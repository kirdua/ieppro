// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import useUserStore from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const store = useUserStore()
  await store.initAuth() // avoid flash/incorrect guard on hard refresh

  // If already logged in, keep auth pages clean
  if ((to.name === 'login' || to.name === 'register') && store.userLoggedIn) {
    return next({ name: 'overview', replace: true })
  }

  // Public routes always allowed
  if (to.meta?.public || !to.meta?.requiresAuth) return next()

  // Protected + not authed -> plain login (NO query params)
  if (!store.userLoggedIn) {
    return next({ name: 'login', replace: true })
  }

  next()
})

// Belt-and-suspenders: scrub any stray ?redirect= someone might hand-type
router.afterEach((to) => {
  if (to.name === 'login' && Object.keys(to.query || {}).length) {
    router.replace({ name: 'login' })
  }
})

export default router
