import { createSSRApp } from 'vue'
import { createRouter } from './router'
import App from './App.vue'

// SSR requires a fresh app instance per request, therefore we export a function
// that creates a fresh app instance. If using Vuex, we'd also be creating a
// fresh store here.
export function createApp() {
  const router = createRouter()

  const app = createSSRApp(App)
  app.use(router)
  return { app }
}
