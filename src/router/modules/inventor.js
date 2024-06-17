import MainLayout from '@/layouts/MainLayout.vue'

const inventorRouter = {
  path: '/inventor',
  component: MainLayout,
  groupName: 'first',
  name: 'inventor',
  meta: {
    slug: 'link',
    permissions: ['view inventor'],
    icon: 'menu_open'
  },
  redirect: { name: 'InventorList' },
  children: [
    {
      path: '',
      component: () => import('@/pages/inventor/InventorList.vue'),
      name: 'InventorList',
      meta: {
        title: '進銷存維護',
        icon: 'fa-solid fa-cart-shopping',
        permissions: ['view inventor'],
      },
    },
  ],
}

export default inventorRouter
