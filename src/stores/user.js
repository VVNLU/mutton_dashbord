import { defineStore } from 'pinia'
import { auth } from '@/firebase'
import { setToken, getToken, removeToken } from '@/utils/auth'

export const useUser = defineStore({
  id: 'user',
  state: () => ({
    user: null,
    token: getToken(), // 初始化 token
  }),
  actions: {
    login(email, password) {
      return auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          this.user = userCredential.user;
          setToken(userCredential.user.accessToken);
          this.token = userCredential.user.accessToken;
        })
    },
    logout() {
      return auth.signOut()
        .then(() => {
          this.user = null;
          removeToken();
          this.token = null;
        })
    },
    register(email, password) {
      return auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          this.user = userCredential.user;
          setToken(userCredential.user.accessToken);
          this.token = userCredential.user.accessToken;
        })
    },
    forgotPassword(email) {
      return auth.sendPasswordResetEmail(email)
        .then((res) => {
          return res
        })
    },
  }
})