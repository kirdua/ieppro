<script setup>
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import useUserStore from '@/stores/user'
import AppBar from '@/components/AppBar.vue'
import NavDrawer from '@/components/NavDrawer.vue'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import '@vuepic/vue-datepicker/dist/main.css'

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.userLoggedIn)
</script>

<template>
  <v-app>
    <Vue3Toastify />
    <nav-drawer v-if="isLoggedIn" />
    <v-main>
      <app-bar v-if="isLoggedIn" />
      <router-view v-slot="{ Component }">
        <component :is="Component" :key="$route.fullPath" />
      </router-view>
    </v-main>
  </v-app>
</template>

<style>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.5s linear;
}

.fade-leave-to {
  transition: all 0s lienar;
  opacity: 0;
}
</style>
