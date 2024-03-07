import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import components from './components'

// Quasar
import { Quasar, QInput, QIcon } from 'quasar'
import 'quasar/dist/quasar.css'
import '@quasar/extras/material-icons/material-icons.css'

const app = createApp(App)

app.use(Quasar, { components: { QInput, QIcon } })
app.use(router)
app.use(components)

app.mount('#app')
