class Role {
  // api欄位
  role = 0

  constructor(obj) {
    if (obj) {
      this.role = obj?.role
    }
  }
}
export default Role
