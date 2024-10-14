class VendorsClassification {

  //api欄位
  name = ""
  sequence = 0
  is_enable = true

  constructor(obj) {
    if (obj) {
      this.name = obj?.name
      this.sequence = obj?.sequence
      this.is_enable = obj?.is_enable
    }
  }
}
export default VendorsClassification
