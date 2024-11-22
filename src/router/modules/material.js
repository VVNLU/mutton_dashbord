import MainLayout from '@/layouts/MainLayout.vue'

const materialRouter = {
  path: '/material',
  group: ['/material-category', '/material'],
  groupName: 'first',
  component: MainLayout,
  meta: {
    title: '原物料管理',
    slug: 'dropdown',
    icon: 'fas fa-seedling'
  },
  redirect: { name: 'MaterialList' },
  children: [
    // 原物料
    {
      path: '/material-category',
      name: 'MaterialCategory',
      meta: {
        slug: 'link'
      },
      redirect: { name: 'MaterialCategoryList' },
      children: [
        {
          path: '',
          component: () =>
            import(
              '@/pages/material/material-category/MaterialCategoryList.vue'
            ),
          name: 'MaterialCategoryList',
          meta: {
            title: '原物料',
            icon: 'chevron_right'
          }
        }
      ]
    },
    // 原物料紀錄
    {
      path: '',
      meta: {
        slug: 'link'
      },
      redirect: { name: 'MaterialList' },
      children: [
        {
          path: '',
          component: () =>
            import('@/pages/material/material-list/MaterialList.vue'),
          name: 'MaterialList',
          meta: {
            title: '原物料紀錄',
            icon: 'chevron_right'
          }
        },
        {
          path: 'create',
          component: () =>
            import('@/pages/material/material-list/MaterialCreate.vue'),
          name: 'MaterialCreate',
          meta: {
            title: '原物料詳情'
          },
          hidden: true
        },
        {
          path: 'edit/:id([A-Za-z0-9_]+)',
          component: () =>
            import('@/pages/material/material-list/MaterialEdit.vue'),
          name: 'MaterialEdit',
          meta: {
            title: '原物料詳情'
          },
          hidden: true
        }
      ]
    }
  ]
}

export default materialRouter
