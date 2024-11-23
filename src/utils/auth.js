import { LOCAL_STORAGE_TOKEN, LOCAL_STORAGE_USER_ID } from '../config/constant'

export function setAuthData(token, uid) {
  localStorage.setItem(LOCAL_STORAGE_TOKEN, token)
  localStorage.setItem(LOCAL_STORAGE_USER_ID, uid)
}

export function getAuthData() {
  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN)
  const uid = localStorage.getItem(LOCAL_STORAGE_USER_ID)
  return { token, uid }
}

export function removeAuthData() {
  localStorage.removeItem(LOCAL_STORAGE_TOKEN)
  localStorage.removeItem(LOCAL_STORAGE_USER_ID)
}
