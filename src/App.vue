<!-- src/App.vue -->
<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { RouterView } from 'vue-router'
import useUserStore from '@/stores/user'
import AppBar from '@/components/AppBar.vue'
import NavDrawer from '@/components/NavDrawer.vue'
import Vue3Toastify from 'vue3-toastify'
import { startIdleLogout, stopIdleLogout } from '@/composables/useIdleLogout'
import 'vue3-toastify/dist/index.css'
import '@vuepic/vue-datepicker/dist/main.css'

const userStore = useUserStore()
const isAuthed = computed(() => userStore.userLoggedIn)
const isAuthReady = computed(() => userStore.isAuthReady)

onMounted(() => startIdleLogout())
onBeforeUnmount(() => stopIdleLogout())
</script>

<template>
  <v-app>
    <Vue3Toastify />
    <template v-if="!isAuthReady">
      <v-main>
        <div class="auth-splash">
          <v-progress-circular indeterminate size="40" />
        </div>
      </v-main>
    </template>

    <template v-else>
      <nav-drawer v-if="isAuthed" />
      <v-main>
        <app-bar v-if="isAuthed" />
        <router-view v-slot="{ Component }">
          <component :is="Component" :key="$route.fullPath" />
        </router-view>
      </v-main>
    </template>
  </v-app>
</template>

<style>
.auth-splash {
  min-height: 60vh;
  display: grid;
  place-items: center;
}

.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: all 0.5s linear;
}
.fade-leave-to {
  transition: all 0s linear;
  opacity: 0;
} /* fixed 'lienar' typo */
</style>
