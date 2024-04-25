import BaseForm from './input/BaseForm.vue'
import DateInput from './input/DateInput.vue'
import DateRangeInput from './input/DateRangeInput.vue'
import EmailInput from './input/EmailInput.vue'
import ImageInput from './input/ImageInput.vue'
import NumberInput from './input/NumberInput.vue'
import TextInput from './input/TextInput.vue'
import PasswordInput from './input/PasswordInput.vue'
import SearchInput from './input/SearchInput.vue'
import SelectInput from './input/SelectInput.vue'
import ToggleInput from './input/ToggleInput.vue'
import UrlInput from './input/UrlInput.vue'
import SkeletonSquare from './skeleton/SkeletonSquare.vue'
import AddButton from './button/AddButton.vue'
import BaseButton from './button/BaseButton.vue'
import BaseIconButton from './button/BaseIconButton.vue'
import ConfirmButton from './button/ConfirmButton.vue'
import CancelButton from './button/CancelButton.vue'
import DeleteIconButton from './button/DeleteIconButton.vue'
import EditIconButton from './button/EditIconButton.vue'
import CardBody from './card/CardBody.vue'
import CardHeader from './card/CardHeader.vue'
import BaseDialog from './dialog/BaseDialog.vue'
import ImagePreviewDialog from './dialog/ImagePreviewDialog.vue'
import BaseImage from './image/BaseImage.vue'
import FixedFooter from './FixedFooter.vue'
import ImageCropper from './ImageCropper.vue'
import ListSearchBlock from './ListSearchBlock.vue'
import Pagination from './Pagination.vue'
import VxeServerTable from './VxeServerTable.vue'
import SvgIcon from './SvgIcon.vue'
import PageHeader from './PageHeader.vue'
import ImageColumn from './table-column/ImageColumn.vue'
import BaseUploader from './uploader/BaseUploader.vue'
import ImageUploader from './uploader/ImageUploader.vue'

export default {
  install(app) {
    app.component('BaseForm', BaseForm)
    app.component('DateInput', DateInput)
    app.component('DateRangeInput', DateRangeInput)
    app.component('EmailInput', EmailInput)
    app.component('ImageInput', ImageInput)
    app.component('NumberInput', NumberInput)
    app.component('TextInput', TextInput)
    app.component('PasswordInput', PasswordInput)
    app.component('SearchInput', SearchInput)
    app.component('SelectInput', SelectInput)
    app.component('ToggleInput', ToggleInput)
    app.component('UrlInput', UrlInput)
    app.component('SkeletonSquare', SkeletonSquare)
    app.component('AddButton', AddButton)
    app.component('BaseButton', BaseButton)
    app.component('BaseIconButton', BaseIconButton)
    app.component('ConfirmButton', ConfirmButton)
    app.component('CancelButton', CancelButton)
    app.component('DeleteIconButton', DeleteIconButton)
    app.component('EditIconButton', EditIconButton)
    app.component('CardBody', CardBody)
    app.component('CardHeader', CardHeader)
    app.component('BaseDialog', BaseDialog)
    app.component('ImagePreviewDialog', ImagePreviewDialog)
    app.component('BaseImage', BaseImage)
    app.component('FixedFooter', FixedFooter)
    app.component('ImageCropper', ImageCropper)
    app.component('ListSearchBlock', ListSearchBlock)
    app.component('Pagination', Pagination)
    app.component('VxeServerTable', VxeServerTable)
    app.component('SvgIcon', SvgIcon)
    app.component('PageHeader', PageHeader)
    app.component('ImageColumn', ImageColumn)
    app.component('BaseUploader', BaseUploader)
    app.component('ImageUploader', ImageUploader)
  },
}
