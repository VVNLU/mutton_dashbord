class MaterialCategory {
  //api欄位
  title = ''
  unit = ''
  is_enable = true

  constructor(obj) {
    if (obj) {
      this.title = obj?.title
      this.unit = obj?.unit
      this.is_enable = obj?.is_enable
    }
  }
}
export default MaterialCategory
