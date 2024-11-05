import MainLayout from '@/layouts/MainLayout.vue'

const productRouter = {
  path: '/product',
  component: MainLayout,
  groupName: 'first',
  name: 'product',
  meta: {
    title: '商品管理',
    slug: 'link',
    icon: 'menu_open'
  },
  redirect: { name: 'ProductList' },
  children: [
    {
      path: '',
      component: () => import('@/pages/product/ProductList.vue'),
      name: 'ProductList',
      meta: {
        title: '商品管理',
        icon: 'fa-solid fa-basket-shopping',
      }
    },
    {
      path: 'create',
      component: () => import('@/pages/product/ProductCreate.vue'),
      name: 'ProductCreate',
      meta: {
        title: '商品管理',
      },
      hidden: true
    },
    {
      path: 'edit/:id([A-Za-z0-9_]+)',
      component: () => import('@/pages/product/ProductEdit.vue'),
      name: 'ProductEdit',
      meta: {
        title: '商品管理',
      },
      hidden: true
    }
  ]
}

export default productRouter
