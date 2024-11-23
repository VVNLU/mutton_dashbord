import MainLayout from '@/layouts/MainLayout.vue'

const orderRouter = {
  path: '/order',
  component: MainLayout,
  groupName: 'first',
  name: 'order',
  meta: {
    title: '訂單管理',
    slug: 'link',
    icon: 'menu_open'
  },
  redirect: { name: 'OrderList' },
  children: [
    {
      path: '',
      component: () => import('@/pages/order/OrderList.vue'),
      name: 'OrderList',
      meta: {
        title: '訂單管理',
        icon: 'fa-solid fa-cart-shopping'
      }
    },
    {
      path: 'create',
      component: () => import('@/pages/order/OrderCreate.vue'),
      name: 'OrderCreate',
      meta: {
        title: '訂單管理'
      },
      hidden: true
    },
    {
      path: 'edit/:id([A-Za-z0-9_]+)',
      component: () => import('@/pages/order/OrderEdit.vue'),
      name: 'OrderEdit',
      meta: {
        title: '訂單管理'
      },
      hidden: true
    }
  ]
}

export default orderRouter
