const TokenKey = 'Dashboard-Rwd-Base-Token'

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function removeToken() {
  return localStorage.removeToken(TokenKey)
}
