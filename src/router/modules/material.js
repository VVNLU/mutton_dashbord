import MainLayout from '@/layouts/MainLayout.vue'

const materialRecordRouter = {
  path: '/material-record',
  group: ['/material-category', '/material-record'],
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
        title: '原物料',
        slug: 'link',
        icon: 'chevron_right'
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
          }
        }
      ]
    },
    // 原物料紀錄
    {
      path: '/material-record',
      meta: {
        title: '原物料紀錄',
        slug: 'link',
        icon: 'chevron_right'
      },
      redirect: { name: 'MaterialList' },
      children: [
        {
          path: '',
          component: () => import('@/pages/material/material-record/MaterialRecordList.vue'),
          name: 'MaterialList',
          meta: {
            title: '原物料紀錄',
          }
        },
        {
          path: 'create',
          component: () =>
            import('@/pages/material/material-record/MaterialRecordCreate.vue'),
          name: 'MaterialCreate',
          meta: {
            title: '原物料詳情'
          },
          hidden: true
        },
        {
          path: 'edit/:id([A-Za-z0-9_]+)',
          component: () => import('@/pages/material/material-record/MaterialRecordEdit.vue'),
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

export default materialRecordRouter
