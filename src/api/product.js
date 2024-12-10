import { db } from '@/firebase'
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
    const processedMaterialItems = data.materialItems.map(item => ({
      materialRef: doc(db, 'material_category', item.id), // 創建 Reference
      materialQuantity: item.materialQuantity,
      materialTitle: item.materialTitle,
      materialUnit: item.materialUnit
    }))


    const docRef = await addDoc(collection(db, 'product'), {
      ...data,
      createdAt: Timestamp.now(),
      updateAt: Timestamp.now(),
      materialItems: processedMaterialItems
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
    const docRef = await getDoc(doc(db, 'product', id))
    const productData = docRef.data()

    // 獲取原物料詳細資訊
    if (productData.materialItems && productData.materialItems.length > 0) {
      const productsDetails = await Promise.all(
        productData.materialItems.map(async (item) => {
          const productSnapshot = await getDoc(item.materialRef)
          return {
            ...item,
            productDetails: productSnapshot.data()
          }
        })
      )
      return {
        ...productData,
        materialItems: productsDetails
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
    const docRef = await getDocs(collection(db, 'product'))
    const data = await Promise.all(
      docRef.docs.map(async (doc) => {
        const productData = { id: doc.id, ...doc.data() }

        // 獲取原物料詳細資訊
        if (productData.materialItems && productData.materialItems.length > 0) {
          const materialsDetails = await Promise.all(
            productData.materialItems.map(async (item) => {
              const productSnapshot = await getDoc(item.materialRef)
              return {
                ...item,
                materialDetails: productSnapshot.data()
              }
            })
          )

          productData.materialItems = materialsDetails
        }

        return productData
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
  try {
    const processedProductItems = newData.materialItems
      ? newData.materialItems.map(item => ({
        materialRef: doc(db, 'product', item.materialRef.id),
        materialQuantity: item.materialQuantity,
        materialTitle: item.materialTitle
      }))
      : undefined
    const updateData = processedProductItems
      ? {
        ...newData,
        materialItems: processedProductItems,
        updateAt: Timestamp.now()
      }
      : {
        ...newData,
        updateAt: Timestamp.now()
      }

    const newDocRef = await updateDoc(doc(db, 'product', docId), updateData)
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
