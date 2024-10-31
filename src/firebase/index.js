import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDnKjgmrVSFRb63LeBDd6YMDlyuz5JSkzM',
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: 'mutton-dashboard',
  storageBucket: 'mutton-dashboard.appspot.com',
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: '1:820459566052:web:1d033145bfde32459a4df1'
}

const app = initializeApp(firebaseConfig) // 初始化 Firebase
const db = getFirestore(app) // 取得 Firestore 實例
const analytics = getAnalytics(app) // 取得分析服務實例
const auth = getAuth() // 取得身份驗證實例
const storage = getStorage(app) // 取得 Firebase Storage

export { app, auth, db, analytics, storage }
