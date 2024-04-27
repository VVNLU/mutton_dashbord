const TokenKey = 'Dashboard-Rwd-Base-Token'
const UIDKey = 'Dashboard-Rwd-Base-UID'

export function setAuthData(token, uid) {
  localStorage.setItem(TokenKey, token);
  localStorage.setItem(UIDKey, uid);
}

export function getAuthData() {
  const token = localStorage.getItem(TokenKey)
  const uid = localStorage.getItem(UIDKey)
  return { token, uid }
}

export function removeAuthData() {
  localStorage.removeItem(TokenKey);
  localStorage.removeItem(UIDKey);
}