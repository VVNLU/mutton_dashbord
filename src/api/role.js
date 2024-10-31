import { db } from '@/firebase'
import { doc, getDoc, deleteDoc, setDoc } from 'firebase/firestore'

// 新增
export const addData = async (uid, role) => {
  try {
    const docRef = doc(db, 'role', uid) // uid 儲存為文件名稱
    await setDoc(docRef, { role: role })
    return docRef
  } catch (error) {
    console.error('Error written document: ', error)
    throw error
  }
}

// 讀取單筆數據
export const getData = async (id) => {
  try {
    const docRef = await getDoc(doc(db, 'role', id))
    return docRef.data()
  } catch (error) {
    console.error('Error getting documents: ', error)
    throw error
  }
}

// 刪除數據
export const deleteData = async (docId) => {
  try {
    const docRef = await deleteDoc(doc(db, 'role', docId))
    return docRef
  } catch (error) {
    console.error('Error deleting document: ', error)
    throw error
  }
}
