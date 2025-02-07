import MainLayout from '@/layouts/MainLayout.vue'

const vendorRouter = {
  path: '/vendor',
  component: MainLayout,
  groupName: 'first',
  name: 'vendor',
  meta: {
    title: '供應商管理',
    slug: 'link',
    icon: 'fa-solid fa-address-book'
  },
  redirect: { name: 'vendorList' },
  children: [
    {
      path: '',
      component: () => import('@/pages/vendor/VendorList.vue'),
      name: 'vendorList',
      meta: {
        title: '供應商管理',
      }
    }
  ]
}

export default vendorRouter
