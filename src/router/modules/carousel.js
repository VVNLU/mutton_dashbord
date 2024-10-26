import MainLayout from '@/layouts/MainLayout.vue'

const carouselRouter = {
  path: '/carousel',
  component: MainLayout,
  groupName: 'first',
  name: 'carousel',
  meta: {
    title: '輪播圖維護',
    slug: 'link',
    permissions: ['view carousel'],
    icon: 'menu_open'
  },
  redirect: { name: 'CarouselList' },
  children: [
    {
      path: '',
      component: () => import('@/pages/carousel/CarouselList.vue'),
      name: 'CarouselList',
      meta: {
        title: '輪播圖維護',
        icon: 'fa-regular fa-image',
        permissions: ['view carousel'],
      },
    },
    {
      path: 'create',
      component: () => import('@/pages/carousel/CarouselCreate.vue'),
      name: 'CarouselCreate',
      meta: {
        title: '輪播圖詳情',
        permissions: ['create carousel'],
      },
      hidden: true
    },
    {
      path: 'edit/:id([A-Za-z0-9_]+)',
      component: () => import('@/pages/carousel/CarouselEdit.vue'),
      name: 'CarouselEdit',
      meta: {
        title: '輪播圖詳情',
        permissions: ['update carousel'],
      },
      hidden: true
    },
  ],
}

export default carouselRouter
