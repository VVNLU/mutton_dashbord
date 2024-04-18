import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyDnKjgmrVSFRb63LeBDd6YMDlyuz5JSkzM",
  authDomain: "mutton-dashboard.firebaseapp.com",
  projectId: "mutton-dashboard",
  storageBucket: "mutton-dashboard.appspot.com",
  messagingSenderId: "820459566052",
  appId: "1:820459566052:web:275d20c8354e945b9a4df1"
}

const app = firebase.initializeApp(firebaseConfig) // 初始化
const auth = firebase.auth() // 取得身份驗證機制
const database = firebase.database() // 取得資料庫
const analytics = firebase.analytics() // 取得分析

export { auth, database, analytics }