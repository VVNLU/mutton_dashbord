import BaseInput from './input/BaseInput.vue'
import AccountInput from './input/AccountInput.vue'
import PasswordInput from './input/PasswordInput.vue'

export default {
  install(app) {
    app.component('BaseInput', BaseInput)
    app.component('AccountInput', AccountInput)
    app.component('PasswordInput', PasswordInput)
  },
}
