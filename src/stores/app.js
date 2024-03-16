import { defineStore } from 'pinia'

export const useApp = defineStore({
  id: 'app',
  state: () => ({
    sidebar: {
      opened: false,
      withoutAnimation: false,
    },
    isLoading: false,
    isCreate: false,
    isUpdate: false,
    isDelete: false,
  }),
  actions: {
    toggleSidebar() {
      this.sidebar.opened = !this.sidebar.opened
      this.sidebar.withoutAnimation = false
      if (this.sidebar.opened) {
        localStorage.setItem('sidebarStatus', 1)
      } else {
        localStorage.setItem('sidebarStatus', 0)
      }
    },
  },
})
