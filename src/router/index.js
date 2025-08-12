// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import useUserStore from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to) => {
  const store = useUserStore()

  // Give Pinia/Firebase state a microtask to settle after login
  await Promise.resolve()

  // If already logged in and trying to access login/register, redirect
  if (to.name === 'login' || to.name === 'register') {
    return store.userLoggedIn ? { name: 'overview' } : true
  }

  // Public routes
  if (!to.meta?.requiresAuth) return true

  // Protected routes
  return store.userLoggedIn ? true : { name: 'login', query: { redirect: to.fullPath } }
})

export default router
