class MaterialCategory {
  //api欄位
  title = ''
  unit = ''
  quantity = 0
  packages = []
  vendors = []

  constructor(obj) {
    if (obj) {
      this.title = obj?.title
      this.unit = obj?.unit
      this.quantity = obj?.quantity
      this.packages = obj?.packages
      this.vendors = obj?.vendors
    }
  }
}
export default MaterialCategory
