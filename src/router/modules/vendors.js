import MainLayout from '@/layouts/MainLayout.vue'

const vendorsRouter = {
  path: '/vendors',
  group: [
    '/vendors-classification',
    '/vendors',
  ],
  groupName: 'first',
  component: MainLayout,
  meta: {
    title: '供應商管理',
    slug: 'dropdown',
    icon: 'fa-solid fa-address-book',
    permissions: ['view vendors'],
  },
  redirect: { name: 'VendorsList' },
  children: [
    // 供應商分類
    {
      path: '/vendors-classification',
      name: 'VendorsClassification',
      meta: {
        slug: 'link',
        permissions: ['view vendors_classification'],
      },
      redirect: { name: 'VendorsClassificationList' },
      children: [
        {
          path: '',
          component: () => import('@/pages/vendors/vendors-classification/VendorsClassificationList.vue'),
          name: 'VendorsClassificationList',
          meta: {
            title: '供應商分類維護',
            icon: 'fas fa-ellipsis',
            permissions: ['view vendors_classification'],
          },
        },
      ],
    },
    // 供應商
    {
      path: '',
      meta: {
        slug: 'link',
        permissions: ['view vendors'],
      },
      redirect: { name: 'VendorsList' },
      children: [
        {
          path: '',
          component: () => import('@/pages/vendors/vendors-list/VendorsList.vue'),
          name: 'VendorsList',
          meta: {
            title: '供應商維護',
            icon: 'fas fa-ellipsis',
            permissions: ['view vendors'],
          },
        },
      ],
    },
  ],
}

export default vendorsRouter
