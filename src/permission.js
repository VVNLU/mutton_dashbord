// import router, { addRoutes } from './router'
// import { NProgress } from 'nprogress'
// import 'nprogress/nprogress.css'
// import { getToken } from '@/utils/auth'
// import { usePermission } from './stores/permission'
// import useLogout from '@/hooks/useLogout'

// NProgress.configure({ showSpinner: false })

// const whiteList = ['/login'] // no redirect whiteList

// router.beforeEach(async (to, from, next) => {
//     // start progress bar
//     NProgress.start()

//     const storePermission = usePermission()
//     const { resetStore } = useLogout()
//     const hasToken = getToken()

//     if (hasToken) {
//         if (to.path === '/login') {
//             next({ path: '/' })
//             NProgress.done()
//         } else {
//             try {
//                 const accessRoutes = await storePermission.generateRoutes({ roles: [] })
//                 addRoutes(accessRoutes, {})
//                 next({ ...to, replace: true })
//             } catch (error) {
//                 resetStore()
//                 next(`/login?redirect=${to.path}`)
//                 NProgress.done()
//             }
//         }
//     } else {
//         if (whiteList.indexOf(to.path) !== -1) {
//             next()
//         } else {
//             next(`/login?redirect${to.path}`)
//             NProgress.done()
//         }
//     }
// })

// router.afterEach((to) => {
//     document.title = '羊入爐後台管理'
//     NProgress.done()
// })
