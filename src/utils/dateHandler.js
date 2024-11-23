import { convertDateTime } from '@/utils/data-convert'

/**
 * 初始化日期欄位
 * @param {Object} data 從 API 獲取的資料
 * @returns {Object} 包含處理後日期的資料
 */
export function initializeDates(data) {
  return {
    ...data,
    createDate: data.createDate ? convertDateTime(data.createDate) : null,
    updateDate: data.updateDate ? convertDateTime(data.updateDate) : null
  }
}

/**
 * 更新日期欄位
 * @param {Object} data 待提交的資料
 * @param {String} mode 操作模式 ('create' 或 'edit')
 * @returns {Object} 包含更新後日期的資料
 */
export function updateDates(data, mode) {
  const updatedData = { ...data }
  if (mode === 'create') {
    updatedData.createDate = convertDateTime()
  }
  if (mode === 'edit') {
    updatedData.updateDate = convertDateTime()
  }
  return updatedData
}
