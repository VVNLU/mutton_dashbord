import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import components from './components'

// Quasar
import quasar from '@/plugins/quasar'
import 'quasar/dist/quasar.css'
import '@quasar/extras/material-icons/material-icons.css'

// plugins
import { useVuelidate } from './plugins/vuelidate'

// Pinia
import { createPinia } from 'pinia'

// i18n
import i18n from './plugins/i18n'

import '@/styles/index.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(quasar)
app.use(router)
app.use(components)
app.use(useVuelidate)
app.use(pinia)
app.use(i18n)

app.mount('#app')
