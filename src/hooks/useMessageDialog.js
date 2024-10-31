import { useMessageDialogStore } from '@/stores/messageDialog'

export default function useMessageDialog() {
  const store = useMessageDialogStore()

  const messageAlert = ({
    title,
    message,
    confirmButtonText,
    confirmButtonColor
  }) =>
    store.alert({
      title: title,
      message,
      persistent: false,
      showCancel: false,
      confirmButtonText: confirmButtonText,
      confirmButtonColor: confirmButtonColor || 'primary'
    })

  const messageConfirm = ({
    title,
    message,
    confirmButtonText,
    confirmButtonColor,
    cancelButtonText,
    cancelButtonColor
  }) =>
    store.alert({
      title: title,
      message,
      persistent: true,
      confirmButtonText: confirmButtonText,
      confirmButtonColor: confirmButtonColor || 'primary',
      showCancel: true,
      cancelButtonText: cancelButtonText,
      cancelButtonColor: cancelButtonColor || 'primary'
    })

  const messageDelete = ({
    title,
    message,
    confirmButtonText,
    confirmButtonColor,
    cancelButtonText
  }) =>
    store.alert({
      title: title,
      status: 'error',
      message,
      persistent: true,
      confirmButtonText: confirmButtonText,
      confirmButtonColor: confirmButtonColor || 'primary',
      showCancel: true,
      cancelButtonText: cancelButtonText,
      cancelButtonColor: 'negative'
    })

  return {
    messageAlert,
    messageConfirm,
    messageDelete
  }
}
