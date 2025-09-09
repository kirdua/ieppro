const routes = [
  {
    path: '/',
    name: 'overview',
    component: () => import('@/views/overview/Dashboard.vue'),
    beforeEnter(to, from, next) {
      next()
    },
    meta: {
      requiresAuth: true,
      header: 'Overview'
    }
  },
  {
    path: '/progress',
    name: 'Annual Progress Report',
    component: () => import('@/views/progress/ProgressReport.vue'),
    beforeEnter(to, from, next) {
      next()
    },
    meta: {
      requiresAuth: true,
      header: 'Annual Progress Report'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/auth/Register.vue')
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/profile/User.vue'),
    beforeEnter(to, from, next) {
      next()
    },
    meta: {
      requiresAuth: true,
      header: 'User Profile'
    }
  },
  {
    path: '/children',
    name: 'children',
    component: () => import('@/views/children/Children.vue'),
    beforeEnter(to, from, next) {
      next()
    },
    meta: {
      requiresAuth: true,
      header: 'Children Profiles'
    }
  },
  {
    path: '/goals',
    name: 'goals',
    component: () => import('@/views/goals/Goals.vue'),
    beforeEnter(to, from, next) {
      next()
    },
    meta: {
      requiresAuth: true,
      header: 'Goals'
    }
  },
  {
    path: '/scheduled-services',
    name: 'scheduled-services',
    component: () => import('@/views/services/ScheduledServices.vue'),
    beforeEnter(to, from, next) {
      next()
    },
    meta: {
      requiresAuth: true,
      header: 'Scheduled Services'
    }
  },
  {
    path: '/add-services',
    name: 'add-services',
    component: () => import('@/views/services/add/AddServices.vue'),
    beforeEnter(to, from, next) {
      next()
    },
    meta: {
      requiresAuth: true,
      header: 'Add Scheduled Services'
    }
  },
  {
    path: '/notes',
    name: 'notes',
    component: () => import('@/views/notes/Notes.vue'),
    beforeEnter(to, from, next) {
      next()
    },
    meta: {
      requiresAuth: true,
      header: 'Notes'
    }
  },
  {
    path: '/class-schedule',
    name: 'class-schedule',
    component: () => import('@/views/schedule/ClassSchedule.vue'),
    beforeEnter(to, from, next) {
      next()
    },
    meta: {
      requiresAuth: true,
      header: 'Class Schedule'
    }
  },
  {
    path: '/iep-upload',
    name: 'iepupload',
    component: () => import('@/components/upload/IepUpload.vue'),
    beforeEnter(to, from, next) {
      next()
    },
    meta: {
      requiresAuth: true,
      header: 'IEP Upload'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

export default routes
