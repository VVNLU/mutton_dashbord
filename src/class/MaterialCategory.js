class MaterialCategory {
  //api欄位
  title = ''
  unit = ''
  packages = []
  vendorIds = []

  constructor(obj) {
    if (obj) {
      this.title = obj?.title
      this.unit = obj?.unit
      this.packages = obj?.packages
      this.vendorIds = obj?.vendorIds
    }
  }
}
export default MaterialCategory
