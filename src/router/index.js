import { createRouter, createWebHistory } from 'vue-router'

import MainLayout from '@/layouts/MainLayout.vue'

/* Router Modules */
import carouselRouter from './modules/carousel'
import materialRouter from './modules/material'
import vendorRouter from './modules/vendor'
import productRouter from './modules/product'
import orderRouter from './modules/order'
import { LOCAL_STORAGE_TOKEN } from '../config/constant'

export const constantRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/entry/login/index.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/pages/entry/register/index.vue')
  },
  {
    path: '/',
    component: MainLayout,
    redirect: '/',
    children: [
      {
        path: '/',
        component: () => import('@/pages/dashboard/index.vue'),
        name: 'dashboard'
      }
    ]
  }
]

export const asyncRoutes = [
  // 有需要輪播圖再打開
  // carouselRouter,
  vendorRouter,
  materialRouter,
  productRouter,
  orderRouter
]

const router = createRouter({
  history: createWebHistory(),
  routes: [...constantRoutes, ...asyncRoutes]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN)
  if (to.name !== 'login' && to.name !== 'register' && !token) {
    next({ name: 'login' })
  }
  next()
})

export default router
