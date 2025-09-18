import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import VueApexCharts from 'vue3-apexcharts'

const app = createApp(App)
const pinia = createPinia()

// Use the persistence plugin
pinia.use(piniaPluginPersistedState)

app.use(pinia)
app.use(router)
app.component('apex-chart', VueApexCharts)
app.mount('#app')
