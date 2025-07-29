import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import useUserStore from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const store = useUserStore()

  // If already logged in and trying to access login/register, redirect
  if ((to.name === 'login' || to.name === 'register') && store.userLoggedIn) {
    next({ name: 'overview' })
    return
  }

  // Allow access to public routes
  if (!to.meta.requiresAuth) {
    console.log('✅ Route does not require auth, proceeding...')
    next()
    return
  }

  // Check auth for protected routes
  if (store.userLoggedIn) {
    console.log('✅ User is logged in, proceeding...')
    next()
  } else {
    console.log('🚨 User not logged in, redirecting to login...')
    next({ name: 'login' })
  }
})

export default router
