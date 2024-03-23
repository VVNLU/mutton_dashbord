import BaseForm from './input/BaseForm.vue'
import TextInput from './input/TextInput.vue'
import PasswordInput from './input/PasswordInput.vue'
import SelectInput from './input/SelectInput.vue'
import BaseButton from './button/BaseButton.vue'
import ConfirmButton from './button/ConfirmButton.vue'
import CancelButton from './button/CancelButton.vue'
import Pagination from './Pagination.vue'
import VxeServerTable from './VxeServerTable.vue'
import SvgIcon from './SvgIcon.vue'
import PageHeader from './PageHeader.vue'
import ImageColumn from './table-column/ImageColumn.vue'

export default {
  install(app) {
    app.component('BaseForm', BaseForm)
    app.component('TextInput', TextInput)
    app.component('PasswordInput', PasswordInput)
    app.component('SelectInput', SelectInput)
    app.component('BaseButton', BaseButton)
    app.component('ConfirmButton', ConfirmButton)
    app.component('CancelButton', CancelButton)
    app.component('Pagination', Pagination)
    app.component('VxeServerTable', VxeServerTable)
    app.component('SvgIcon', SvgIcon)
    app.component('PageHeader', PageHeader)
    app.component('ImageColumn', ImageColumn)
  },
}
