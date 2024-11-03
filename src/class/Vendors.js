class Vendors {
  //api欄位
  title = '' // 公司名稱
  name = '' // 聯絡人
  tel = ''
  address = ''
  supplies = '' // 供應品項
  remark = ''

  constructor(obj) {
    if (obj) {
      this.title = obj?.title
      this.name = obj?.name
      this.tel = obj?.tel
      this.address = obj?.address
      this.supplies = obj?.supplies
      this.remark = obj?.remark
    }
  }
}
export default Vendors
