import { db } from '@/firebase'
import { doc, collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where } from "firebase/firestore"
import { uploadFile } from "@/firebase/fileUpload"

// 新增
export const addData = async (data) => {
  try {
    let imageUrl = ''
    if (data.imageObj && data.imageObj.raw) {
      imageUrl = await uploadFile(data.imageObj.raw)
    }

    const docData = { ...data, imageUrl }
    delete docData.imageObj // 不能存在 Firestore

    const docRef = await addDoc(collection(db, "carousel_list"), docData)
    return docRef
  } catch (error) {
    console.error("Error written document: ", error)
    throw error
  }
}

// 讀取單筆數據
export const getData = async (id) => {
  try {
    const docRef = await getDoc(doc(db, "carousel_list", id))
    return docRef.data()
  } catch (error) {
    console.error("Error getting documents: ", error)
    throw error
  }
}

// 讀取列表數據
export const getList = async () => {
  try {
    const docRef = await getDocs(collection(db, "carousel_list"))
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
    if (newData.imageObj && newData.imageObj.raw) {
      const imageUrl = await uploadFile(newData.imageObj.raw)
      newData.imageUrl = imageUrl
    }
    delete newData.imageObj // 不能存在 Firestore


    const newDocRef = await updateDoc(doc(db, "carousel_list", docId), newData)
  } catch (error) {
    console.error("Error updating document:", error)
    throw error
  }
}

// 刪除數據
export const deleteData = async (docId) => {
  try {
    const docRef = await deleteDoc(doc(db, "carousel_list", docId))
  } catch (error) {
    console.error("Error deleting document: ", error)
    throw error
  }
}