import { convertDateTime } from '@/utils/data-convert'

class Material {

  //api欄位
  date = convertDateTime()
  contents = []

  constructor(obj) {
    if (obj) {
      this.date = obj?.date && convertDateTime(obj?.date)
      this.contents = obj?.contents ? obj.contents.map(content => ({
        price: content.price || '',
        quantity: content.quantity || '',
        title: content.title || '',
        total: content.total || '',
        unit: content.unit || '',
      })) : []
    }
  }
}
export default Material
