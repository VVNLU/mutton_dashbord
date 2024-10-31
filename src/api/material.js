import { db } from '@/firebase'
import { doc, collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc } from "firebase/firestore"

// 新增
export const addData = async (data) => {
  try {
    const docRef = await addDoc(collection(db, "material_list"), data)
    return docRef
  } catch (error) {
    console.error("Error written document: ", error)
    throw error
  }
}

// 讀取單筆數據
export const getData = async (id) => {
  try {
    const docRef = await getDoc(doc(db, "material_list", id))
    return docRef.data()
  } catch (error) {
    console.error("Error getting documents: ", error)
    throw error
  }
}

// 讀取列表數據
export const getList = async () => {
  try {
    const docRef = await getDocs(collection(db, "material_list"))
    const data = docRef.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    return data
  } catch (error) {
    console.error("Error getting list: ", error)
    throw error
  }
}

// 更新數據
export const updateData = async (docId, newData) => {
  try {
    const newDocRef = await updateDoc(doc(db, "material_list", docId), newData)
    return newDocRef
  } catch (error) {
    console.error("Error updating document:", error)
    throw error
  }
}

// 刪除數據
export const deleteData = async (docId, docIndex) => {
  console.log('66', docId, docIndex)
  try {
    const docRef = doc(db, "material_list", docId)
    const docSnapshot = await getDoc(docRef)
    if (!docSnapshot.exists()) {
      throw new Error("Document does not exist!")
    }

    const currentData = docSnapshot.data()
    console.log('455', currentData.contents[docIndex])
  } catch (error) {
    console.error("Error deleting document: ", error)
    throw error
  }
}