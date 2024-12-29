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
      categoryRef: doc(db, 'material_category', item.id), // 創建 Reference
    }))

    const docRef = await addDoc(collection(db, 'material_record'), {
      ...data,
      createdAt: Timestamp.now(),
      updateAt: Timestamp.now(),
      items: processedMaterialItems
    })

    for (const item of processedMaterialItems) {
      const { categoryRef, quantity, selectedPackage } = item
      const packageSize = selectedPackage.size ?? 1

      await updateDoc(categoryRef, {
        quantity: increment(quantity * packageSize) // 累加數量
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
    const recordData = docRef.data()

    // 獲取原物料詳細資訊
    if (recordData.items && recordData.items.length > 0) {
      const categoryDetails = await Promise.all(
        recordData.items.map(async (item) => {
          const recordSnapshot = await getDoc(item.categoryRef)
          return {
            ...item,
            categoryDetails: recordSnapshot.data()
          }
        })
      )
      return {
        ...recordData,
        items: categoryDetails
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
    const docRef = await getDocs(collection(db, 'material_record'))
    const data = await Promise.all(
      docRef.docs.map(async (doc) => {
        const recordData = { id: doc.id, ...doc.data() }

        // 獲取原物料詳細資訊
        if (recordData.items && recordData.items.length > 0) {
          const categoriesDetails = await Promise.all(
            recordData.items.map(async (item) => {
              const recordSnapshot = await getDoc(item.categoryRef)
              return {
                ...item,
                categoryDetails: recordSnapshot.data()
              }
            })
          )

          recordData.items = categoriesDetails
        }

        return recordData
      })
    )
    return data

    // const data = docRef.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    // return data
  } catch (error) {
    console.error('Error getting list: ', error)
    throw error
  }
}

// 更新數據
export const updateData = async (docId, newData) => {
  try {
    const docRef = doc(db, 'material_record', docId)
    const docSnapshot = await getDoc(docRef)

    if (!docSnapshot.exists()) {
      throw new Error('Document does not exist!')
    }

    const originalData = docSnapshot.data()

    const updatedMaterialItems = newData.items.map(item => ({
      ...item,
      categoryRef: doc(db, 'material_category', item.id),
    }))

    // 更新原物料紀錄
    await updateDoc(docRef, {
      ...newData,
      updatedAt: Timestamp.now(),
      items: updatedMaterialItems,
    })

    // 找出 originalData 中未在 newData 出現的項目
    const removedItems = originalData.items.filter(
      originalItem => !updatedMaterialItems.some(newItem => newItem.id === originalItem.id)
    )

    for (const removedItem of removedItems) {
      const removedcategoryRef = doc(db, 'material_category', removedItem.id)
      const removedPackageSize = removedItem.selectedPackage.size ?? 1

      await updateDoc(removedcategoryRef, {
        quantity: increment(-removedItem.quantity * removedPackageSize),
      })
    }

    for (const newItem of updatedMaterialItems) {
      const { categoryRef, quantity, selectedPackage } = newItem
      const newPackageSize = selectedPackage.size ?? 1
      const originalItem = originalData.items.find(item => item.id === newItem.id)

      if (originalItem) {
        const originalPackageSize = originalItem.selectedPackage.size ?? 1

        // originalQuantity 歸零
        await updateDoc(categoryRef, {
          quantity: increment(-originalItem.quantity * originalPackageSize),
        })
      }

      const newQuantity = quantity * newPackageSize
      // 儲存新的 newQuantity
      await updateDoc(categoryRef, {
        quantity: increment(newQuantity),
      })
    }

    return docRef
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
    const docRef = doc(db, 'material_record', docId)
    const docSnapshot = await getDoc(docRef)

    if (!docSnapshot.exists()) {
      throw new Error('Document does not exist!')
    }

    const currentData = docSnapshot.data()

    // 扣除已進貨的原物料數量
    for (const item of currentData.items) {
      const categoryRef = item.categoryRef
      const packageSize = item.selectedPackage.size ?? 1
      await updateDoc(categoryRef, {
        quantity: increment(-item.quantity * packageSize)
      })
    }

    await deleteDoc(docRef)

    return docRef
  } catch (error) {
    console.error('Error deleting document: ', error)
    throw error
  }
}