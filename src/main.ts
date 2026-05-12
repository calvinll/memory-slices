import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import uviewPlus from 'uview-plus'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)

  app.use(createPinia())

  // uview-plus 在 uni-app(vite) 下建议以 plugin + globalProperties 方式挂载
  app.use(uviewPlus)
  // @ts-expect-error uview-plus runtime inject
  app.config.globalProperties.$u = uviewPlus

  return {
    app,
  }
}
