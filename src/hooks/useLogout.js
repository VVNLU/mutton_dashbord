import router from '@/router'
import useNotify from './useNotify'

export default function useLogout() {
  const { notify } = useNotify()

  const resetStore = () => {
    notify({ message: '登出成功', type: 'positive' })
    router.push('/login')
  }
  return {
    resetStore,
  }
}
