import { Quasar, Notify, Loading } from 'quasar'

import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass'

import 'quasar/src/css/index.sass'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'

export default {
  install(app) {
    app.use(Quasar, {
      plugins: {
        Notify,
        Loading
      },
      config: {
        notify: {}
      }
    })
  }
}
