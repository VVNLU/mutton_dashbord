class MaterialCategory {
  //api欄位
  title = ''
  unit = ''
  quantity = 0
  packages = []
  vendorIds = []

  constructor(obj) {
    if (obj) {
      this.title = obj?.title
      this.unit = obj?.unit
      this.quantity = obj?.quantity
      this.packages = obj?.packages
      this.vendorIds = obj?.vendorIds
    }
  }
}
export default MaterialCategory
