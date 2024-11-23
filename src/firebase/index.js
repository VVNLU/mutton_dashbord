import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig) // 初始化 Firebase
const db = getFirestore(app) // 取得 Firestore 實例
const analytics = getAnalytics(app) // 取得分析服務實例
const auth = getAuth() // 取得身份驗證實例
const storage = getStorage(app) // 取得 Firebase Storage

export { app, auth, db, analytics, storage }
