import { convertDateTime } from '@/utils/data-convert'

class Inventor {
  // api欄位
  date = convertDateTime()
  restock = 0
  chongqing_market = 0
  shiba_market = 0
  delivery = 0
  pick_up = 0
  gift = 0
  remark = ''

  constructor(obj) {
    if (obj) {
      this.date = obj?.date && convertDateTime(obj?.date)
      this.restock = obj?.restock
      this.chongqing_market = obj?.chongqing_market
      this.shiba_market = obj?.shiba_market
      this.delivery = obj?.delivery
      this.pick_up = obj?.pick_up
      this.gift = obj?.gift
      this.remark = obj?.remark
    }
  }
}
export default Inventor
