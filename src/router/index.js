import { createRouter, createWebHistory } from 'vue-router'

import MainLayout from '@/layouts/MainLayout.vue'

/* Router Modules */
import carouselRouter from './modules/carousel'
import inventorRouter from './modules/inventor'

export const constantRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/entry/login/index.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/pages/entry/register/index.vue'),
  },
  {
    path: '/',
    component: MainLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/pages/dashboard/index.vue'),
        name: 'dashboard',
      },
    ],
  },
]

export const asyncRoutes = [
  carouselRouter,
  inventorRouter,
]

const router = createRouter({
  history: createWebHistory(),
  routes: [...constantRoutes, ...asyncRoutes]
})

router.beforeEach((to) => {
  if (
    to.name !== 'login' &&
    to.name !== 'register' &&
    localStorage.getItem("Dashboard-Rwd-Base-Token") === null
  ) {
    return { name: 'login' || 'register' }
  }
})
router.beforeEach((to) => {
  if (to.name === 'login' && localStorage.getItem("Dashboard-Rwd-Base-Token") !== null) {
    return { name: 'dashboard' }
  }
})

// export function addRoutes(routes = [], { parent = '' }) {
//   routes.forEach((route) => {
//     if (parent) {
//       router.addRoute(parent, route)
//     } else {
//       router.addRoute(route)
//     }
//   })
// }

export default router
