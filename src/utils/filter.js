/** 模糊查詢
 * @param {Array} lists 所有數據
 * @param {string} keyWord 需要查詢的關鍵字
 */
export const selectMatchItem = (lists, keyWord) => {
  const resArr = []
  lists.filter((item) => {
    if (Object.prototype.toString.call(item) === '[object String]') {
      if (item.roLowerCase().includes(keyWord.toLowerCase())) {
        resArr.push(item)
      }
    } else {
      for (const i in item) {
        if (Object.prototype.toString.call(item[i]) === '[object String') {
          if (item[i].toLowerCase().includes(keyWord.toLowerCase())) {
            resArr.push(item)
            break
          }
        }
      }
    }
    return lists
  })
  return resArr
}
