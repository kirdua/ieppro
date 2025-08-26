// src/main.js
import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import '@/lib/firebaseClient' // set Firebase persistence early

import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import useUserStore from '@/stores/user'

loadFonts()

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(vuetify)
app.use(Vue3Toastify, { autoClose: 3000, position: 'top-right' })

const store = useUserStore()

// 1) Know auth state before routing to avoid flicker
await store.initAuth()

// 2) If we loaded a protected route but aren't authed, bounce to login *before* first paint
if (router.currentRoute.value.meta?.requiresAuth && !store.userLoggedIn) {
  await router.replace({ name: 'login' })
}

// 3) React to timer/manual sign-out while on a protected route
watch(
  () => store.userLoggedIn,
  (loggedIn) => {
    if (!loggedIn && router.currentRoute.value.meta?.requiresAuth) {
      router.replace({ name: 'login' })
    }
  },
  { immediate: false }
)

// 4) Mount after the initial route is settled
await router.isReady()
app.mount('#app')
