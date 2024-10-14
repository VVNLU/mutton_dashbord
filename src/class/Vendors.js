import VendorsClassification from "./VendorsClassification"


class Vendors {

  //api欄位
  title = ""
  info = ""

  constructor(obj) {
    if (obj) {
      this.title = obj?.title
      this.info = obj?.info
    }
  }
}
export default Vendors
