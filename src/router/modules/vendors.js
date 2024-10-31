import MainLayout from '@/layouts/MainLayout.vue'

const vendorsRouter = {
  path: '/vendors',
  component: MainLayout,
  groupName: 'first',
  name: 'vendors',
  meta: {
    title: '供應商管理',
    slug: 'link',
    icon: 'menu_open'
  },
  redirect: { name: 'VendorsList' },
  children: [
    {
      path: '',
      component: () => import('@/pages/vendors/VendorsList.vue'),
      name: 'VendorsList',
      meta: {
        title: '供應商管理',
        icon: 'fa-solid fa-address-book'
      }
    }
  ]
}

export default vendorsRouter
