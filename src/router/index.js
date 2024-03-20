import { createRouter, createWebHistory } from 'vue-router'

import MainLayout from '@/layouts/MainLayout.vue'

/* Router Modules */
import carouselRouter from './modules/carousel'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/pages/login/index.vue'),
  },
  {
    path: '/',
    component: MainLayout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        component: () => import('@/pages/dashboard/index.vue'),
        name: 'Dashboard',
      },
    ],
  },
]

export const asyncRoutes = [carouselRouter]

const router = createRouter({
  history: createWebHistory(),
  routes: [...constantRoutes, ...asyncRoutes]
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
