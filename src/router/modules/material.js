import MainLayout from '@/layouts/MainLayout.vue'

const materialRouter = {
  path: '/material',
  group: [
    '/material-classification',
    '/material',
  ],
  groupName: 'first',
  component: MainLayout,
  meta: {
    title: '原物料管理',
    slug: 'dropdown',
    icon: 'fas fa-seedling',
    permissions: ['view material'],
  },
  redirect: { name: 'MaterialList' },
  children: [
    // 最新消息分類
    {
      path: '/material-classification',
      name: 'MaterialClassification',
      meta: {
        slug: 'link',
        permissions: ['view material_classification'],
      },
      redirect: { name: 'MaterialClassificationList' },
      children: [
        {
          path: '',
          component: () => import('@/pages/material/material-classification/MaterialClassificationList.vue'),
          name: 'MaterialClassificationList',
          meta: {
            title: '原物料分類維護',
            icon: 'fas fa-ellipsis',
            permissions: ['view material_classification'],
          },
        },
      ],
    },
    // 最新消息
    {
      path: '',
      meta: {
        slug: 'link',
        permissions: ['view material'],
      },
      redirect: { name: 'MaterialList' },
      children: [
        {
          path: '',
          component: () => import('@/pages/material/material-list/MaterialList.vue'),
          name: 'MaterialList',
          meta: {
            title: '原物料維護',
            icon: 'fas fa-ellipsis',
            permissions: ['view material'],
          },
        },
        {
          path: 'create',
          component: () => import('@/pages/material/material-list/MaterialCreate.vue'),
          name: 'MaterialCreate',
          meta: {
            title: '原物料詳情',
            permissions: ['create material'],
          },
          hidden: true
        },
        {
          path: 'edit/:id([A-Za-z0-9_]+)',
          component: () => import('@/pages/material/material-list/MaterialEdit.vue'),
          name: 'MaterialEdit',
          meta: {
            title: '原物料詳情',
            permissions: ['update material'],
          },
          hidden: true
        },
      ],
    },
  ],
}

export default materialRouter
