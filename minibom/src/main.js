import './assets/main.scss'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import{createPersistedState} from'pinia-persistedstate-plugin'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
const pinia=createPinia();
const persist=createPersistedState();
pinia.use(persist)
app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}