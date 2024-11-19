class MaterialClassification {
  //api欄位
  name = ''
  unit = ''
  is_enable = true

  constructor(obj) {
    if (obj) {
      this.name = obj?.name
      this.unit = obj?.unit
      this.is_enable = obj?.is_enable
    }
  }
}
export default MaterialClassification
