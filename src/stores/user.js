import { defineStore } from 'pinia'
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth'
import { auth } from '@/firebase'
import { setAuthData, getAuthData, removeAuthData } from '@/utils/auth'
import { addData } from '@/api/role'

const password = import.meta.env.VITE_PASSWORD
export const useUser = defineStore({
  id: 'user',
  // password: import.meta.env.VITE_PASSWORD,
  state: () => ({
    user: null,
    token: getAuthData() // 初始化 token
  }),
  actions: {
    async login(email) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          `${email}@admin.com.tw`,
          password
        )

        this.user = userCredential.user;
        this.token = userCredential.user.accessToken;
        setAuthData(userCredential.user.accessToken, userCredential.user.uid);
        return userCredential;
      } catch (error) {
        console.error('Login error:', error.message)
        throw error
      }
    },

    async logout() {
      return signOut(auth).then(() => {
        this.user = null
        this.token = null
        this.role = null
        removeAuthData()
      })
    },

    // register(email, password, role = 'user') {
    //   return createUserWithEmailAndPassword(auth, email, password).then(
    //     (userCredential) => {
    //       this.user = userCredential.user
    //       this.token = userCredential.user.accessToken

    //       return addData(userCredential.user.uid, role).then(() => {
    //         this.role = role
    //         setAuthData(
    //           userCredential.user.accessToken,
    //           userCredential.user.uid,
    //           role
    //         )
    //       })
    //     }
    //   )
    // },

    // forgotPassword(email) {
    //   return sendPasswordResetEmail(auth, email).then((res) => {
    //     return res
    //   })
    // }
  }
})
