import { db } from '@/firebase'
import {
  doc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  Timestamp,
  where
} from 'firebase/firestore'

// 時間戳
export const addDataWithTimestamp = async (data) => {
  try {
    const docRef = await addDoc(collection(db, 'material_category'), {
      ...data,
      createdAt: Timestamp.now(),
      updateAt: Timestamp.now()
    })
    return docRef
  } catch (error) {
    console.error('Error written document: ', error)
    throw error
  }
}

// 新增
export const addData = async (data) => {
  try {
    const docRef = await addDataWithTimestamp(data)
    return docRef
  } catch (error) {
    console.error('Error written document: ', error)
    throw error
  }
}

// 讀取單筆數據
export const getData = async (id) => {
  try {
    const docRef = await getDoc(doc(db, 'material_category', id))
    return docRef.data()
  } catch (error) {
    console.error('Error getting documents: ', error)
    throw error
  }
}

// 讀取列表數據
export const getList = async () => {
  try {
    const docRef = await getDocs(collection(db, 'material_category'))
    const data = docRef.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    return data
  } catch (error) {
    console.error('Error getting list: ', error)
    throw error
  }
}

// 更新數據
export const updateData = async (docId, newData) => {
  try {
    const newDocRef = await updateDoc(
      doc(db, 'material_category', docId),
      {
        ...newData,
        updateAt: Timestamp.now() // 更新時間為當前時間
      })
    return newDocRef
  } catch (error) {
    console.error('Error updating document:', error)
    throw error
  }
}

// 刪除數據
export const deleteData = async (docId) => {
  try {
    const docRef = await deleteDoc(doc(db, 'material_category', docId))
    return docRef
  } catch (error) {
    console.error('Error deleting document: ', error)
    throw error
  }
}

// 關聯供應商
// 讀取多筆數據（根據多個ID）
export const getDataByIds = async (ids) => {
  try {
    console.log('ids', ids)
    const querySnapshot = await getDocs(
      collection(db, 'vendor'),
      where('__name__', 'in', ids)
    )

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    return data
  } catch (error) {
    console.error('Error getting documents by IDs:', error)
    throw error
  }
}
