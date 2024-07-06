import { convertDateTime } from '@/utils/data-convert'

class Material {

  //api欄位
  date = convertDateTime()
  contents = {}

  constructor(obj) {
    if (obj) {
      this.date = obj?.date && convertDateTime(obj?.date)
      this.contents = obj?.contents
    }
  }
}
export default Material
