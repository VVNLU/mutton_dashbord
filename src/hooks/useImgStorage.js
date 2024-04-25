import { db } from '@/firebase'

export default function useImgStorage() {
  const getImageSrc = async ({ filename, size = '100x' }) => {
    try {
      if (!filename) return ''

      const docRef = db.collection('config').doc('fileServerHost')
      const docSnapshot = await docRef.get()
      if (docSnapshot.exists()) {
        const fileServerHost = docSnapshot.data().value
        const url = `${fileServerHost}/display/resize/${size}/${filename}`
        return url
      } else {
        console.log('File server host configuration not found in Firebase')
        return ''
      }
    } catch (error) {
      console.log('Error fetching file server hot configuration from Firebase')
      return ''
    }
  }
  return {
    getImageSrc
  }
}