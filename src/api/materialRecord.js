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
      const { materialRef, quantity, selectedPackage } = item
      const packageSize = selectedPackage.size ?? 1

      await updateDoc(materialRef, {
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
    const docRef = doc(db, 'material_record', docId)
    const docSnapshot = await getDoc(docRef)

    if (!docSnapshot.exists()) {
      throw new Error('Document does not exist!')
    }

    const originalData = docSnapshot.data()

    const updatedMaterialItems = newData.items.map(item => ({
      ...item,
      materialRef: doc(db, 'material_category', item.id),
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
      const removedMaterialRef = doc(db, 'material_category', removedItem.id)
      const removedPackageSize = removedItem.selectedPackage.size ?? 1

      await updateDoc(removedMaterialRef, {
        quantity: increment(-removedItem.quantity * removedPackageSize),
      })
    }

    for (const newItem of updatedMaterialItems) {
      const { materialRef, quantity, selectedPackage } = newItem
      const newPackageSize = selectedPackage.size ?? 1
      const originalItem = originalData.items.find(item => item.id === newItem.id)

      if (originalItem) {
        const originalPackageSize = originalItem.selectedPackage.size ?? 1

        // originalQuantity 歸零
        await updateDoc(materialRef, {
          quantity: increment(-originalItem.quantity * originalPackageSize),
        })
      }

      const newQuantity = quantity * newPackageSize
      // 儲存新的 newQuantity
      await updateDoc(materialRef, {
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
      const materialRef = item.materialRef
      const packageSize = item.selectedPackage.size ?? 1
      await updateDoc(materialRef, {
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