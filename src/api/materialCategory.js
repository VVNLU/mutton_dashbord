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
} from 'firebase/firestore'

// 時間戳
export const addDataWithTimestamp = async (data) => {
  try {
    const processedVendors = data.vendors.map(item => doc(db, 'vendor', item.id))

    const docRef = await addDoc(collection(db, 'material_category'), {
      ...data,
      createdAt: Timestamp.now(),
      updateAt: Timestamp.now(),
      vendors: processedVendors
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
    const categoryData = docRef.data()

    if (categoryData.vendors && categoryData.vendors.length > 0) {
      const categoriesDetails = await Promise.all(
        categoryData.vendors.map(async (item) => {
          const categorySnapshot = await getDoc(item)
          const categoryDetails = categorySnapshot.data()
          if (categoryDetails !== undefined) {
            return {
              ...item,
              id: item.id,
              categoryDetails
            }
          }
        })
      )
      return {
        ...categoryData,
        vendors: categoriesDetails.filter(Boolean)
      }
    }
  } catch (error) {
    console.error('Error getting documents: ', error)
    throw error
  }
}

// 讀取列表數據
export const getList = async () => {
  try {
    const docRef = await getDocs(collection(db, 'material_category'))
    const data = await Promise.all(
      docRef.docs.map(async (doc) => {
        const categoryData = { id: doc.id, ...doc.data() }

        // 獲取原物料詳細資訊
        if (categoryData.vendors.length > 0) {
          const vendorsDetails = await Promise.all(
            categoryData.vendors.map(async (item) => {
              const productSnapshot = await getDoc(item)
              return {
                ...item,
                vendorDetails: productSnapshot.data()
              }
            })
          )

          categoryData.vendors = vendorsDetails
        }

        return categoryData
      })
    )

    return data
  } catch (error) {
    console.error('Error getting list: ', error)
    throw error
  }
}

// 更新數據
export const updateData = async (docId, newData) => {
  const processedVendors = newData.vendors.map(item => doc(db, 'vendor', item.id))

  try {
    const newDocRef = await updateDoc(
      doc(db, 'material_category', docId),
      {
        ...newData,
        vendors: processedVendors,
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
