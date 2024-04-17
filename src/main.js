import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import components from './components'
import 'virtual:svg-icons-register'

// Quasar
import quasar from '@/plugins/quasar'
import 'quasar/dist/quasar.css'
import '@quasar/extras/material-icons/material-icons.css'

// plugins
import { useVuelidate } from './plugins/vuelidate'
import vxeTable from './plugins/vxe-table'
import { useDayjs } from '@/plugins/dayjs'

// Pinia
import { createPinia } from 'pinia'

// i18n
// import i18n from './plugins/i18n'

import '@/styles/index.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(quasar)
app.use(router)
app.use(components)
app.use(useVuelidate)
app.use(vxeTable)
app.use(useDayjs)
app.use(pinia)
// app.use(i18n)

app.mount('#app')
