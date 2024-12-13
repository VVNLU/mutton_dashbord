import { Notify } from 'quasar'

export default function useNotify() {
  const notify = ({
    message,
    type = 'info',
    timeout = 3000,
  }) =>
    Notify.create({
      message,
      type,
      timeout,
    })

  const notifyAPIError = ({ message }) =>
    Notify.create({
      message,
      type: 'negative',
    })

  const notifyError = ({ message }) =>
    Notify.create({
      message,
      type: 'negative',
    })

  const customNotify = ({
    message,
    timeout = 3000,
    color = 'brown',
    textColor = 'white',
    icon = 'announcement'
  }) =>
    Notify.create({
      message,
      timeout,
      color,
      textColor,
      icon
    })
  return {
    notify,
    notifyAPIError,
    notifyError,
    customNotify
  }
}
