import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import Navbar from './components/Navbar.vue'


const app = createApp(App)
app.use(createPinia())
app.use(router)
app.component('Navbar',Navbar)
app.mount('#app')