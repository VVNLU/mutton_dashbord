import { defineStore } from 'pinia'
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth'
import { auth } from '@/firebase'
import { setAuthData, getAuthData, removeAuthData } from '@/utils/auth'
import { getData, addData } from '@/api/role'

export const useUser = defineStore({
  id: 'user',
  state: () => ({
    user: null,
    token: getAuthData(), // 初始化 token
    role: null
  }),
  actions: {
    async login(email, password) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          `${email}@admin.com.tw`,
          password
        )
        this.user = userCredential.user
        this.token = userCredential.user.accessToken

        const userRole = await getData(userCredential.user.uid)
        this.role = userRole.role
        setAuthData(
          userCredential.user.accessToken,
          userCredential.user.uid,
          'userRole.role'
        )
        return userRole
      } catch (e) {
        console.log(e)
      }
    },

    logout() {
      return signOut(auth).then(() => {
        this.user = null
        this.token = null
        this.role = null
        removeAuthData()
      })
    },

    register(email, password, role = 'user') {
      return createUserWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          this.user = userCredential.user
          this.token = userCredential.user.accessToken

          return addData(userCredential.user.uid, role).then(() => {
            this.role = role
            setAuthData(
              userCredential.user.accessToken,
              userCredential.user.uid,
              role
            )
          })
        }
      )
    },

    forgotPassword(email) {
      return sendPasswordResetEmail(auth, email).then((res) => {
        return res
      })
    }
  }
})
