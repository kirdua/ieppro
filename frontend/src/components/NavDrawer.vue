<script setup>
import { ref, computed } from 'vue'
import navbarRoutes from '@/includes/navbar-routes'
import useUserStore from '@/stores/user'

const userStore = useUserStore()
const { userInfo } = userStore

const drawer = ref(true)
const rail = ref(true)
const items = navbarRoutes

const userName = computed(() => {
  return userInfo.name.split(' ')[0]
})
</script>
<template>
  <v-card>
    <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false">
      <v-list-item :title="userName" nav>
        <template v-slot:append>
          <v-btn icon="mdi-chevron-left" variant="text" @click.stop="rail = !rail"></v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="item.title"
          :value="item.value"
          :to="item.route"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>
