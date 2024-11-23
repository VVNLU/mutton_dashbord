const TokenKey = 'Dashboard-Rwd-Base-Token'
const UIDKey = 'Dashboard-Rwd-Base-UID'
const RoleKey = 'Dashboard-Rwd-Base-Role'

export function setAuthData(token, uid) {
  localStorage.setItem(TokenKey, token)
  localStorage.setItem(UIDKey, uid)
}

export function getAuthData() {
  const token = localStorage.getItem(TokenKey)
  const uid = localStorage.getItem(UIDKey)
  const role = localStorage.getItem(RoleKey)
  return { token, uid, role }
}

export function removeAuthData() {
  localStorage.removeItem(TokenKey)
  localStorage.removeItem(UIDKey)
  localStorage.removeItem(RoleKey)
}
