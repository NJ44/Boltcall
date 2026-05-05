// ─────────────────────────────────────────────────────────────────────────────
// Boltcall — Azure Resource Provisioning
//
// Deploys:
//   1. Azure OpenAI (gpt-4o-mini + gpt-4o) — replaces Anthropic API
//   2. Azure Communication Services — replaces Twilio SMS
//   3. Log Analytics Workspace — shared telemetry sink
//   4. Application Insights — SaaS observability
//   5. Container Apps Environment — managed runtime for n8n
//   6. n8n Container App + Azure Files volume — replaces Hostinger VPS
//
// Deploy:
//   az group create -n boltcall-rg -l eastus
//   az deployment group create -g boltcall-rg --template-file azure/main.bicep \
//     --parameters location=eastus n8nBasicAuthUser=admin n8nBasicAuthPassword=CHANGE_ME
// ─────────────────────────────────────────────────────────────────────────────

@description('Azure region for all resources')
param location string = 'eastus'

@description('Resource name prefix')
param prefix string = 'boltcall'

@description('n8n admin username for basic auth')
param n8nBasicAuthUser string = 'boltcall'

@description('n8n admin password — CHANGE THIS before deploying')
@secure()
param n8nBasicAuthPassword string

@description('Public URL where n8n will be reachable (e.g. https://n8n.boltcall.org)')
param n8nWebhookUrl string = ''

// ─── 1. Azure OpenAI ─────────────────────────────────────────────────────────

resource openAI 'Microsoft.CognitiveServices/accounts@2023-05-01' = {
  name: '${prefix}-openai'
  location: location
  sku: { name: 'S0' }
  kind: 'OpenAI'
  properties: {
    publicNetworkAccess: 'Enabled'
    customSubDomainName: '${prefix}-openai'
  }
}

// Light model: gpt-4o-mini — used for SMS/WhatsApp drafts, lead qualification, KB extraction
resource deploymentMini 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01' = {
  parent: openAI
  name: 'gpt-4o-mini'
  sku: { name: 'Standard', capacity: 120 }  // 120K TPM
  properties: {
    model: { format: 'OpenAI', name: 'gpt-4o-mini', version: '2024-07-18' }
    versionUpgradeOption: 'OnceCurrentVersionExpired'
  }
}

// Heavy model: gpt-4o — used for email drafts, prompt editing, agent self-heal
resource deploymentHeavy 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01' = {
  parent: openAI
  name: 'gpt-4o'
  dependsOn: [deploymentMini]
  sku: { name: 'Standard', capacity: 40 }   // 40K TPM
  properties: {
    model: { format: 'OpenAI', name: 'gpt-4o', version: '2024-08-06' }
    versionUpgradeOption: 'OnceCurrentVersionExpired'
  }
}

// ─── 2. Azure Communication Services ─────────────────────────────────────────

resource acs 'Microsoft.Communication/communicationServices@2023-04-01' = {
  name: '${prefix}-acs'
  location: 'global'  // ACS is a global service
  properties: {
    dataLocation: 'United States'
  }
}

// ─── 3. Log Analytics Workspace ──────────────────────────────────────────────

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: '${prefix}-logs'
  location: location
  properties: {
    sku: { name: 'PerGB2018' }
    retentionInDays: 30
  }
}

// ─── 4. Application Insights ─────────────────────────────────────────────────

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${prefix}-insights'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
    RetentionInDays: 30
  }
}

// ─── 5. Container Apps Environment ───────────────────────────────────────────

resource containerEnv 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: '${prefix}-container-env'
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalytics.properties.customerId
        sharedKey: logAnalytics.listKeys().primarySharedKey
      }
    }
  }
}

// ─── Storage account + file share for n8n persistent data ────────────────────

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: '${replace(prefix, '-', '')}n8nstorage'  // storage account names: lowercase, no hyphens
  location: location
  sku: { name: 'Standard_LRS' }
  kind: 'StorageV2'
  properties: { minimumTlsVersion: 'TLS1_2' }
}

resource fileService 'Microsoft.Storage/storageAccounts/fileServices@2023-01-01' = {
  parent: storageAccount
  name: 'default'
}

resource fileShare 'Microsoft.Storage/storageAccounts/fileServices/shares@2023-01-01' = {
  parent: fileService
  name: 'n8n-data'
  properties: { shareQuota: 10 }
}

// Mount the file share inside the Container Apps Environment
resource storageMount 'Microsoft.App/managedEnvironments/storages@2023-05-01' = {
  parent: containerEnv
  name: 'n8n-storage'
  properties: {
    azureFile: {
      accountName: storageAccount.name
      accountKey: storageAccount.listKeys().keys[0].value
      shareName: fileShare.name
      accessMode: 'ReadWrite'
    }
  }
}

// ─── 6. n8n Container App ─────────────────────────────────────────────────────

var webhookUrl = empty(n8nWebhookUrl) ? 'https://${prefix}-n8n.${containerEnv.properties.defaultDomain}' : n8nWebhookUrl

resource n8nApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: '${prefix}-n8n'
  location: location
  properties: {
    managedEnvironmentId: containerEnv.id
    configuration: {
      ingress: {
        external: true
        targetPort: 5678
        transport: 'http'
      }
    }
    template: {
      containers: [
        {
          name: 'n8n'
          image: 'docker.n8n.io/n8nio/n8n:latest'
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
          env: [
            { name: 'N8N_HOST', value: '0.0.0.0' }
            { name: 'N8N_PORT', value: '5678' }
            { name: 'N8N_PROTOCOL', value: 'https' }
            { name: 'WEBHOOK_URL', value: webhookUrl }
            { name: 'N8N_BASIC_AUTH_ACTIVE', value: 'true' }
            { name: 'N8N_BASIC_AUTH_USER', value: n8nBasicAuthUser }
            { name: 'N8N_BASIC_AUTH_PASSWORD', secretRef: 'n8n-password' }
            { name: 'N8N_RUNNERS_ENABLED', value: 'true' }
            { name: 'EXECUTIONS_DATA_PRUNE', value: 'true' }
            { name: 'EXECUTIONS_DATA_MAX_AGE', value: '336' }  // 14 days
            { name: 'N8N_LOG_LEVEL', value: 'info' }
            { name: 'N8N_METRICS', value: 'true' }
          ]
          volumeMounts: [
            {
              volumeName: 'n8n-data'
              mountPath: '/home/node/.n8n'
            }
          ]
        }
      ]
      volumes: [
        {
          name: 'n8n-data'
          storageType: 'AzureFile'
          storageName: storageMount.name
        }
      ]
      scale: {
        minReplicas: 1  // always-on — n8n is stateful
        maxReplicas: 1
      }
    }
  }
  dependsOn: [storageMount]
}

// ─── Outputs ──────────────────────────────────────────────────────────────────

@description('Azure OpenAI endpoint — set as AZURE_OPENAI_ENDPOINT in Netlify env')
output azureOpenAIEndpoint string = openAI.properties.endpoint

@description('Azure OpenAI API key — set as AZURE_OPENAI_API_KEY in Netlify env')
output azureOpenAIKey string = openAI.listKeys().key1

@description('ACS connection string — set as ACS_CONNECTION_STRING in Netlify env')
output acsConnectionString string = acs.listKeys().primaryConnectionString

@description('Application Insights connection string — wire to Netlify functions for observability')
output appInsightsConnectionString string = appInsights.properties.ConnectionString

@description('n8n URL — update all Boltcall webhooks to point here')
output n8nUrl string = 'https://${n8nApp.properties.configuration.ingress.fqdn}'

@description('Log Analytics workspace ID')
output logAnalyticsWorkspaceId string = logAnalytics.id
