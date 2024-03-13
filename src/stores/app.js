import { defineStore } from 'pinia'

export const useApp = defineStore({
  id: 'app',
  state: () => ({
    isLoading: false,
    isCreate: false,
    isUpdate: false,
    isDelete: false,
  }),
  actions: {},
})
