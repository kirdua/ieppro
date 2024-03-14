const routes = [
  {
    path: '/',
    name: 'overview',
    component: () => import('@/views/overview/Dashboard.vue')
  },
  {
    path: '/progress',
    name: 'progress',
    component: () => import('@/views/progress/ProgressReport.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/register/Register.vue')
  }
]

export default routes
