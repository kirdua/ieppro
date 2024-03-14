const routes = [
  {
    path: '/',
    name: 'overview',
    component: () => import('@/views/overview/Dashboard.vue'),
    beforeEnter(to, from, next) {
      next()
    },
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/progress',
    name: 'progress',
    component: () => import('@/views/progress/ProgressReport.vue'),
    beforeEnter(to, from, next) {
      next()
    },
    meta: {
      requiresAuth: true
    }
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
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'overview' }
  }
]

export default routes
