import { convertDateTime } from '@/utils/data-convert'

/**
 * 初始化日期欄位
 * @param {Object} data 從 API 獲取的資料
 * @returns {Object} 包含處理後日期的資料
 */
export function initializeDates(data) {
  return {
    ...data,
    create_at: data.create_at ? convertDateTime(data.create_at) : null,
    publish_at: data.publish_at ? convertDateTime(data.publish_at) : null,
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
    updatedData.create_at = convertDateTime()
  }
  if (mode === 'edit') {
    updatedData.publish_at = convertDateTime()
  }
  return updatedData
}
