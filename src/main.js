import { createApp } from 'vue'
import App from './App.vue'
import { Quasar } from 'quasar'
import router from './router'

const app = createApp(App)

app.use(Quasar)
app.use(router)

app.mount('#app')
