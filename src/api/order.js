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
    const timestamp = Timestamp.now()
    const date = timestamp.toDate() // 轉為 JavaScript Date 對象

    const orderNumber = `${date.getFullYear()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${date
        .getHours()
        .toString()
        .padStart(2, '0')}${date
          .getMinutes()
          .toString()
          .padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`

    const processedProductItems = data.productItems.map(item => ({
      productRef: doc(db, 'product', item.id), // 創建 Reference
      productQuantity: item.productQuantity,
      productPrice: item.productPrice,
      subtotal: item.subtotal,
      productTitle: item.productTitle
    }))

    const docRef = await addDoc(collection(db, 'order'), {
      ...data,
      orderNumber: orderNumber,
      createdAt: timestamp,
      updateAt: timestamp,
      productItems: processedProductItems,
    })

    // 處理原物料紀錄
    if (data.isDelivered === '已出貨') {
      await processMaterialRecords(processedProductItems, orderNumber, docRef.id)
    }

    return docRef
  } catch (error) {
    console.error('Error written document: ', error)
    throw error
  }
}

// 處理原物料扣減及新增紀錄
const processMaterialRecords = async (productItems, orderNumber, orderId) => {
  const timestamp = Timestamp.now()
  const formattedDate = new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(timestamp.toDate())

  try {
    const materialsMap = {}

    for (const item of productItems) {
      const productSnapshot = await getDoc(item.productRef)
      if (!productSnapshot.exists()) continue

      const productData = productSnapshot.data()

      if (productData.materialItems && productData.materialItems.length > 0) {
        for (const material of productData.materialItems) {
          const materialSnapshot = await getDoc(material.materialRef)
          if (!materialSnapshot.exists()) continue

          const materialQuantity = material.materialQuantity * item.productQuantity
          const materialKey = material.materialRef.id

          if (!materialsMap[materialKey]) {
            materialsMap[materialKey] = {
              materialRef: material.materialRef,
              title: material.materialTitle,
              totalQuantity: 0,
              unit: material.materialUnit,
            }
          }
          materialsMap[materialKey].totalQuantity -= materialQuantity
        }
      }
    }

    for (const materialKey in materialsMap) {
      const materialData = materialsMap[materialKey]
      const materialRef = materialData.materialRef

      // 累減原物料數量
      await updateDoc(materialRef, {
        quantity: increment(materialData.totalQuantity), // 使用累減
      })
    }

    const materialRecords = Object.values(materialsMap).map(material => ({
      materialRef: material.materialRef,
      title: material.title,
      quantity: material.totalQuantity,
      unit: material.unit,
    }))

    if (materialRecords.length > 0) {
      await addDoc(collection(db, 'material_record'), {
        orderId,
        orderNumber,
        date: formattedDate,
        createdAt: timestamp,
        updateAt: timestamp,
        remark: `由訂單 ${orderNumber} 生成`,
        type: '銷貨',
        items: materialRecords,
      })
    }
  } catch (error) {
    console.error('Error processing material records:', error)
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
    const docRef = await getDoc(doc(db, 'order', id))
    const orderData = docRef.data()

    // 獲取商品詳細資訊
    if (orderData.productItems && orderData.productItems.length > 0) {
      const productsDetails = await Promise.all(
        orderData.productItems.map(async (item) => {
          const productSnapshot = await getDoc(item.productRef)
          return {
            ...item,
            productDetails: productSnapshot.data()
          }
        })
      )

      return {
        ...orderData,
        productItems: productsDetails
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
    const docRef = await getDocs(collection(db, 'order'))
    const data = await Promise.all(
      docRef.docs.map(async (doc) => {
        const orderData = { id: doc.id, ...doc.data() }

        // 獲取商品詳細資訊
        if (orderData.productItems && orderData.productItems.length > 0) {
          const productsDetails = await Promise.all(
            orderData.productItems.map(async (item) => {
              const productSnapshot = await getDoc(item.productRef)
              return {
                ...item,
                productDetails: productSnapshot.data()
              }
            })
          )

          orderData.productItems = productsDetails
        }

        return orderData
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
    // 獲取現有的訂單數據
    const docRef = doc(db, 'order', docId)
    const currentDoc = await getDoc(docRef)

    if (!currentDoc.exists()) {
      throw new Error('Document does not exist!')
    }

    const currentData = currentDoc.data()
    const currentIsDelivered = currentData.isDelivered
    const newIsDelivered = newData.isDelivered

    const processedProductItems = newData.productItems
      ? newData.productItems.map(item => ({
        productRef: doc(db, 'product', item.productRef.id),
        productQuantity: item.productQuantity,
        productPrice: item.productPrice,
        subtotal: item.subtotal,
        productTitle: item.productTitle
      }))
      : undefined
    const updateData = processedProductItems
      ? {
        ...newData,
        productItems: processedProductItems,
        updateAt: Timestamp.now()
      }
      : {
        ...newData,
        updateAt: Timestamp.now()
      }
    // 更新訂單數據
    await updateDoc(docRef, updateData)

    // 狀態從「未出貨」變為「已出貨」時觸發原物料處理
    if (
      currentIsDelivered !== '已出貨' &&
      newIsDelivered === '已出貨' &&
      processedProductItems
    ) {
      await processMaterialRecords(processedProductItems, newData.orderNumber, docId)
    }
  } catch (error) {
    console.error('Error updating document:', error)
    throw error
  }
}

// 刪除某一數據
export const removeData = async (docId, docIndex) => {
  try {
    const docRef = doc(db, 'order', docId)
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
    const docRef = await deleteDoc(doc(db, 'order', docId))
    return docRef
  } catch (error) {
    console.error('Error deleting document: ', error)
    throw error
  }
}
