class MaterialCategory {
  //api欄位
  title = ''
  unit = ''

  constructor(obj) {
    if (obj) {
      this.title = obj?.title
      this.unit = obj?.unit
    }
  }
}
export default MaterialCategory
