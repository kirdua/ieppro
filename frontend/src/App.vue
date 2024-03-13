<script setup>
import { RouterView } from 'vue-router'
import NavDrawer from '@/components/NavDrawer.vue'
</script>

<template>
  <v-app>
    <nav-drawer />
    <v-containter fluid>
      <v-main>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component"></component>
          </transition>
        </router-view>
      </v-main>
    </v-containter>
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
