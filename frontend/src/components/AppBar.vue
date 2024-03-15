<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import useAppStore from '@/stores/app'
import useUserStore from '@/stores/user'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const { toggleNavDrawer } = appStore
const { logout } = userStore

const goToProfile = () => {
  router.push('/profile')
}

const logoutHandler = async () => {
  await logout()
  router.push('/login')
}

const items = [
  { title: 'Profile', action: goToProfile, icon: 'mdi-account' },
  { title: 'Logout', action: logoutHandler, icon: 'mdi-logout' }
]
</script>
<template>
  <v-app-bar flat class="justify-end">
    <template v-slot:prepend> </template>

    <v-app-bar-title></v-app-bar-title>
    <v-menu open-on-hover class="justify-end">
      <template v-slot:activator="{ props }">
        <v-btn icon color="primary" v-bind="props">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item v-for="(item, index) in items" :key="index" @click="item.action">
          <v-list-item-content class="custom-list-item">
            <v-list-item-icon class="mr-2">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<style scoped>
.custom-list-item {
  display: inline-flex;
}
</style>
