import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/analytics'
import 'firebase/storage'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
}

const app = firebase.initializeApp(firebaseConfig) // 初始化
const auth = firebase.auth() // 取得身份驗證機制
const database = firebase.database(app) // 取得資料庫
const analytics = firebase.analytics(app) // 取得分析
const storage = firebase.storage(app) // Cloud Storage
const firestore = firebase.firestore(app) // Cloud Firestore

export { auth, database, analytics, storage, firestore }