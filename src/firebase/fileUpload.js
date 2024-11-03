import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './index'

/**
 * 上傳文件到 Firebase Storage 並返回文件的下載 URL
 * @param {File} file - 要上傳的文件
 * @returns {Promise<string>} - 文件的下載 URL
 */

export const uploadFile = async (file) => {
  if (!file) {
    throw new Error('No file provided for upload.')
  }

  const storageRef = ref(storage, `images/${file.name}`)
  await uploadBytes(storageRef, file) // 上傳文件
  const downloadURL = await getDownloadURL(storageRef) // 獲取文件下載的 URL

  return downloadURL
}
