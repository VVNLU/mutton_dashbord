import TextInput from './input/TextInput.vue'
import PasswordInput from './input/PasswordInput.vue'
import BaseButton from './button/BaseButton.vue'
import ConfirmButton from './button/ConfirmButton.vue'
import CancelButton from './button/CancelButton.vue'

export default {
  install(app) {
    app.component('TextInput', TextInput)
    app.component('PasswordInput', PasswordInput)
    app.component('BaseButton', BaseButton)
    app.component('ConfirmButton', ConfirmButton)
    app.component('CancelButton', CancelButton)
  },
}
