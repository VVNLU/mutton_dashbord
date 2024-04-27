import { useMessageDialogStore } from '@/stores/messageDialog'

export default function useMessageDialog() {
    const store = useMessageDialogStore()

    const messageAlert = ({ title, message, confirmButtonText, confirmButtonColor }) => store.alert({
        title,
        message,
        persistent: false,
        confirmButtonText,
        confirmButtonColor: confirmButtonColor || 'primary'
    })

    const messageConfirm = ({ title, message, confirmButtonText, confirmButtonColor, cancelButtonText, cancelButtonColor }) => store.alert({
        title,
        message,
        persistent: true,
        confirmButtonText,
        confirmButtonColor: confirmButtonColor || 'primary',
        showCancel: true,
        cancelButtonText,
        cancelButtonColor: cancelButtonColor || 'primary'
    })

    const messageDelete = ({ title, message, cancelButtonText, cancelButtonColor }) => store.alert({
        title,
        status: 'error',
        message,
        persistent: true,
        confirmButtonText,
        confirmButtonColor: 'negative',
        showCancel: true,
        cancelButtonText,
        cancelButtonColor: cancelButtonColor || 'primary'
    })

    return {
        messageAlert,
        messageConfirm,
        messageDelete
    }
}