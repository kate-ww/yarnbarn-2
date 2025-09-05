// Main entry point for Vue.js application
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import TailwindCSS styles
import './style.css'

const app = createApp(App)

app.use(router)

app.mount('#app')