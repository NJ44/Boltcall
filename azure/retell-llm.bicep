// ─────────────────────────────────────────────────────────────────────────────
// Retell LLM Server — Azure Container App
//
// Provides the WebSocket relay between Retell and Azure OpenAI gpt-5.4-mini.
// Retell handles all telephony (STT / TTS / call logic).
// This server handles the "brain" — LLM inference via Azure OpenAI Foundry.
//
// Deploy (after pushing Docker image to ACR):
//   az deployment group create -g boltcall-rg \
//     --template-file azure/retell-llm.bicep \
//     --parameters foundryEndpoint=<endpoint> foundryKey=<key> \
//                  supabaseUrl=<url> supabaseServiceKey=<key>
//
// First deploy uses a placeholder image; update with:
//   az containerapp update -n boltcall-retell-llm -g boltcall-rg \
//     --image boltcallacr.azurecr.io/retell-llm-server:latest
// ─────────────────────────────────────────────────────────────────────────────

@description('Azure region — must match the existing Container Apps Environment region')
param location string = 'eastus'

@description('Resource name prefix')
param prefix string = 'boltcall'

@description('Azure OpenAI Foundry endpoint (Resource C)')
param foundryEndpoint string

@secure()
@description('Azure OpenAI Foundry API key')
param foundryKey string

@description('Foundry model deployment name for voice (light/fast tier)')
param foundryDeployment string = 'gpt-5.4-mini'

@description('Supabase project URL')
param supabaseUrl string

@secure()
@description('Supabase service role key (for server-side agent lookups)')
param supabaseServiceKey string

@description('Container image to deploy — use placeholder on first deploy, then update')
param containerImage string = 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'

// ─── Reference existing resources ────────────────────────────────────────────

resource containerEnv 'Microsoft.App/managedEnvironments@2023-05-01' existing = {
  name: '${prefix}-container-env'
}

// ─── Azure Container Registry ─────────────────────────────────────────────────
// Basic SKU (~$5/mo on Azure credits) — stores retell-llm-server Docker image

resource acr 'Microsoft.ContainerRegistry/registries@2023-01-01-preview' = {
  name: '${replace(prefix, '-', '')}acr'  // boltcallacr — no hyphens allowed
  location: location
  sku: { name: 'Basic' }
  properties: {
    adminUserEnabled: true
  }
}

// ─── Container App: retell-llm-server ─────────────────────────────────────────

resource retellLlmApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: '${prefix}-retell-llm'
  location: location
  properties: {
    managedEnvironmentId: containerEnv.id
    configuration: {
      ingress: {
        external: true
        targetPort: 8080
        transport: 'http'        // Container Apps terminates TLS; server receives plain HTTP/WS
        allowInsecure: false
      }
      registries: [
        {
          server: acr.properties.loginServer
          username: acr.listCredentials().username
          passwordSecretRef: 'acr-password'
        }
      ]
      secrets: [
        { name: 'acr-password', value: acr.listCredentials().passwords[0].value }
        { name: 'foundry-key', value: foundryKey }
        { name: 'supabase-service-key', value: supabaseServiceKey }
      ]
    }
    template: {
      containers: [
        {
          name: 'retell-llm-server'
          image: containerImage
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
          env: [
            { name: 'PORT', value: '8080' }
            { name: 'AZURE_OPENAI_FOUNDRY_ENDPOINT', value: foundryEndpoint }
            { name: 'AZURE_OPENAI_FOUNDRY_KEY', secretRef: 'foundry-key' }
            { name: 'AZURE_OPENAI_FOUNDRY_DEPLOYMENT', value: foundryDeployment }
            { name: 'SUPABASE_URL', value: supabaseUrl }
            { name: 'SUPABASE_SERVICE_KEY', secretRef: 'supabase-service-key' }
          ]
        }
      ]
      scale: {
        minReplicas: 1   // CRITICAL: always warm — cold start during a call = dead air
        maxReplicas: 10  // scale for concurrent calls (each call = 1 persistent WS connection)
      }
    }
  }
}

// ─── Outputs ──────────────────────────────────────────────────────────────────

@description('WebSocket URL — set as RETELL_LLM_WEBSOCKET_URL in Netlify env vars')
output websocketUrl string = 'wss://${retellLlmApp.properties.configuration.ingress.fqdn}/llm-websocket'

@description('ACR login server — run: az acr login --name boltcallacr, then docker push here')
output acrLoginServer string = acr.properties.loginServer

@description('Container App FQDN')
output appFqdn string = retellLlmApp.properties.configuration.ingress.fqdn
