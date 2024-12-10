import { db } from '@/firebase'
import { increment } from 'firebase/firestore'
import {
  doc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  arrayRemove,
  Timestamp
} from 'firebase/firestore'

// 時間戳
export const addDataWithTimestamp = async (data) => {
  try {
    const processedMaterialItems = data.items.map(item => ({
      ...item,
      materialRef: doc(db, 'material_category', item.id), // 創建 Reference
    }))

    const docRef = await addDoc(collection(db, 'material_record'), {
      ...data,
      createdAt: Timestamp.now(),
      updateAt: Timestamp.now(),
      items: processedMaterialItems
    })

    for (const item of processedMaterialItems) {
      const { materialRef, quantity } = item
      await updateDoc(materialRef, {
        quantity: increment(quantity) // 累加數量
      })
    }

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
    const docRef = await getDoc(doc(db, 'material_record', id))
    return docRef.data()
  } catch (error) {
    console.error('Error getting documents: ', error)
    throw error
  }
}

// 讀取列表數據
export const getList = async () => {
  try {
    const docRef = await getDocs(collection(db, 'material_record'))
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
    const newDocRef = await updateDoc(doc(db, 'material_record', docId), newData)
    return newDocRef
  } catch (error) {
    console.error('Error updating document:', error)
    throw error
  }
}

// 刪除某一數據
export const removeData = async (docId, docIndex) => {
  try {
    const docRef = doc(db, 'material_record', docId)
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
    const docRef = await deleteDoc(doc(db, 'material_record', docId))
    return docRef
  } catch (error) {
    console.error('Error deleting document: ', error)
    throw error
  }
}
