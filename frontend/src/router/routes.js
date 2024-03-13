const routes = [
  {
    path: '/',
    name: 'overview',
    component: () => import('@/views/Dashboard.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/About.vue')
  }
]

export default routes
