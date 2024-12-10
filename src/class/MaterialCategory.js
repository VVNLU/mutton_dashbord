class MaterialCategory {
  //api欄位
  title = ''
  unit = ''
  quantity = 0
  packages = []
  vendorItems = []

  constructor(obj) {
    if (obj) {
      this.title = obj?.title
      this.unit = obj?.unit
      this.quantity = obj?.quantity
      this.packages = obj?.packages
      this.vendorItems = obj?.vendorItems
    }
  }
}
export default MaterialCategory
