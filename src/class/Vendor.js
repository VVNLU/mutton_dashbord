class vendor {
  //api欄位
  title = '' // 公司名稱
  contact = '' // 聯絡人
  tel = ''
  address = ''
  remark = ''

  constructor(obj) {
    if (obj) {
      this.title = obj?.title
      this.contact = obj?.contact
      this.tel = obj?.tel
      this.address = obj?.address
      this.remark = obj?.remark
    }
  }
}
export default vendor
