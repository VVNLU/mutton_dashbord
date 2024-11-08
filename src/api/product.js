import { db } from '@/firebase'
import {
  doc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  arrayRemove
} from 'firebase/firestore'

// 新增
export const addData = async (data) => {
  try {
    const docRef = await addDoc(collection(db, 'product'), data)
    return docRef
  } catch (error) {
    console.error('Error written document: ', error)
    throw error
  }
}

// 讀取單筆數據
export const getData = async (id) => {
  try {
    const docRef = await getDoc(doc(db, 'product', id))
    return docRef.data()
  } catch (error) {
    console.error('Error getting documents: ', error)
    throw error
  }
}

// 讀取列表數據
export const getList = async () => {
  try {
    const docRef = await getDocs(collection(db, 'product'))
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
    const newDocRef = await updateDoc(doc(db, 'product', docId), newData)
    return newDocRef
  } catch (error) {
    console.error('Error updating document:', error)
    throw error
  }
}

// 刪除某一數據
export const removeData = async (docId, docIndex) => {
  try {
    const docRef = doc(db, 'product', docId)
    const docSnapshot = await getDoc(docRef)
    if (!docSnapshot.exists()) {
      throw new Error('Document does not exist!')
    }

    const currentData = docSnapshot.data()
    await updateDoc(docRef, {
      contents: arrayRemove(currentData.contents[docIndex])
    })
  } catch (error) {
    console.error('Error deleting document: ', error)
    throw error
  }
}

// 刪除整筆數據
export const deleteData = async (docId) => {
  try {
    const docRef = await deleteDoc(doc(db, 'product', docId))
    return docRef
  } catch (error) {
    console.error('Error deleting document: ', error)
    throw error
  }
}
