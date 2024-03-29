import BaseForm from './input/BaseForm.vue'
import DateRangeInput from './input/DateRangeInput.vue'
import TextInput from './input/TextInput.vue'
import PasswordInput from './input/PasswordInput.vue'
import SearchInput from './input/SearchInput.vue'
import SelectInput from './input/SelectInput.vue'
import ToggleInput from './input/ToggleInput.vue'
import SkeletonSquare from './skeleton/SkeletonSquare.vue'
import AddButton from './button/AddButton.vue'
import BaseButton from './button/BaseButton.vue'
import BaseIconButton from './button/BaseIconButton.vue'
import ConfirmButton from './button/ConfirmButton.vue'
import CancelButton from './button/CancelButton.vue'
import DeleteIconButton from './button/DeleteIconButton.vue'
import EditIconButton from './button/EditIconButton.vue'
import BaseDialog from './dialog/BaseDialog.vue'
import ImagePreviewDialog from './dialog/ImagePreviewDialog.vue'
import BaseImage from './image/BaseImage.vue'
import ListSearchBlock from './ListSearchBlock.vue'
import Pagination from './Pagination.vue'
import VxeServerTable from './VxeServerTable.vue'
import SvgIcon from './SvgIcon.vue'
import PageHeader from './PageHeader.vue'
import ImageColumn from './table-column/ImageColumn.vue'

export default {
  install(app) {
    app.component('BaseForm', BaseForm)
    app.component('DateRangeInput', DateRangeInput)
    app.component('TextInput', TextInput)
    app.component('PasswordInput', PasswordInput)
    app.component('SearchInput', SearchInput)
    app.component('SelectInput', SelectInput)
    app.component('ToggleInput', ToggleInput)
    app.component('SkeletonSquare', SkeletonSquare)
    app.component('AddButton', AddButton)
    app.component('BaseButton', BaseButton)
    app.component('BaseIconButton', BaseIconButton)
    app.component('ConfirmButton', ConfirmButton)
    app.component('CancelButton', CancelButton)
    app.component('DeleteIconButton', DeleteIconButton)
    app.component('EditIconButton', EditIconButton)
    app.component('BaseDialog', BaseDialog)
    app.component('ImagePreviewDialog', ImagePreviewDialog)
    app.component('BaseImage', BaseImage)
    app.component('ListSearchBlock', ListSearchBlock)
    app.component('Pagination', Pagination)
    app.component('VxeServerTable', VxeServerTable)
    app.component('SvgIcon', SvgIcon)
    app.component('PageHeader', PageHeader)
    app.component('ImageColumn', ImageColumn)
  },
}
