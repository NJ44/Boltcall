import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import posthog from 'posthog-js'
import './i18n';
import './index.css'
import './styles/nav.css'
import App from './App.tsx'

posthog.init('phc_xKVmBF5Ryf5DJxvcWUDU7WnCT8e9MZYnvVwFhDWnYpsJ', {
  api_host: 'https://us.i.posthog.com',
  person_profiles: 'identified_only',
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
