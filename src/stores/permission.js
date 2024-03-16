import { asyncRoutes, constantRoutes } from '@/router'
import { defineStore } from 'pinia'

const canAccess = (roles, permissions, route) => {
  if (route.meta) {
    let hasRole = true
    let hasPermission = true
    if (route.meta.roles || route.meta.permissions) {
      hasRole = false
      hasPermission = false
      if (route.meta.roles) {
        hasRole = roles.some((role) => route.meta.roles.includes(role))
      }
      if (route.meta.permissions) {
        hasPermission = permissions.some((permission) =>
          route.meta.permissions.includes(permission)
        )
      }
    }
    return hasRole || hasPermission
  }
  return true
}

const filterAsyncRoutes = (routes, roles, permissions) => {
  const res = []
  routes.forEach((route) => {
    const tmp = { ...route }
    if (canAccess(roles, permissions, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles, permissions)
      }
      res.push(tmp)
    }
  })
  return res
}

export const uerPermission = defineStore({
  id: 'permission',
  state: () => ({
    routes: [],
    addRoutes: [],
  }),
  actions: {
    generateRoutes({ roles, permissions }) {
      return new Promise((resolve) => {
        let accessedRoutes = []
        if (roles.includes('admin')) {
          accessedRoutes = asyncRoutes || []
        } else {
          accessedRoutes = filterAsyncRoutes(asyncRoutes, roles, permissions)
        }
        this.setRoutes(accessedRoutes)
        resolve(accessedRoutes)
      })
    },
    setRoutes(routes) {
      this.addRoutes = routes
      this.routes = constantRoutes.concat(routes)
    },
  },
})
