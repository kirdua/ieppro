// src/main.js
import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { initFirebasePersistence } from '@/lib/firebaseClient' // <— import the init fn

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

;(async () => {
  await initFirebasePersistence()

  await store.initAuth()

  if (router.currentRoute.value.meta?.requiresAuth && !store.userLoggedIn) {
    await router.replace({ name: 'login' })
  }

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
})().catch((e) => {
  console.error('Bootstrap failed:', e)
})
