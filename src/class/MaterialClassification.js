class MaterialClassification {

  //api欄位
  name = ""
  unit = ""
  sequence = 0
  is_enable = true

  constructor(obj) {
    if (obj) {
      this.name = obj?.name
      this.unit = obj?.unit
      this.sequence = obj?.sequence
      this.is_enable = obj?.is_enable
    }
  }
}
export default MaterialClassification
