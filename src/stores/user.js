import { defineStore } from 'pinia'
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
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
      return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          this.user = userCredential.user;
          setToken(userCredential.user.accessToken);
          this.token = userCredential.user.accessToken;
        })
    },
    logout() {
      return signOut(auth)
        .then(() => {
          this.user = null;
          removeToken();
          this.token = null;
        })
    },
    register(email, password) {
      return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          this.user = userCredential.user;
          setToken(userCredential.user.accessToken);
          this.token = userCredential.user.accessToken;
        })
    },
    forgotPassword(email) {
      return sendPasswordResetEmail(auth, email)
        .then((res) => {
          return res
        })
    },
  }
})