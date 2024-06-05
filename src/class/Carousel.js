import { convertDateTime } from '@/utils/data-convert'

class Carousel {
  // api欄位
  create_at = convertDateTime()
  publish_date = convertDateTime()
  closed_date = ''
  title = ''
  summary = ''
  link = ''
  is_link_blank = false
  is_enable = true
  image_title = ''
  image_alt = ''
  sequence = 0
  imageObj = {}

  constructor(obj) {
    if (obj) {
      this.id = obj?.id
      this.create_at = obj?.create_at && convertDateTime(obj?.create_at)
      this.publish_date = obj?.publish_date && convertDateTime(obj?.publish_date, 'YYYY/MM/DD HH:mm:ss')
      this.closed_date = obj?.closed_date && convertDateTime(obj?.closed_date)
      this.title = obj?.title
      this.summary = obj?.summary
      this.link = obj?.link
      this.is_link_blank = obj?.is_link_blank
      this.is_enable = obj?.is_enable
      this.image_title = obj?.image_title
      this.image_alt = obj?.image_alt
      this.sequence = obj?.sequence
      this.imageObj = obj?.imageObj
    }
  }
}
export default Carousel