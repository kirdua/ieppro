<script setup>
import { ref, computed } from 'vue'
import navbarRoutes from '@/utils/navbar-routes'
import useUserStore from '@/stores/user'

const userStore = useUserStore()
const { userInfo } = userStore

const items = navbarRoutes
const drawer = ref(true)
const rail = ref(true)

const userName = computed(() => {
  return userInfo?.name ? userInfo.name : 'User'
})

const activeItem = ref('') // Store the active item route

const setActiveItem = (route) => {
  activeItem.value = route
  rail.value = true // Close rail when an item is clicked
}
</script>

<template>
  <v-card>
    <v-navigation-drawer v-model="drawer" :rail="rail" permanent color="#385F73">
      <v-list-item :title="userName" nav>
        <template v-slot:append>
          <v-btn icon="mdi-chevron-left" variant="text" @click.stop="rail = !rail"></v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>
      <v-list nav>
        <template v-for="item in items" :key="item.title">
          <!-- Tooltip only when rail is collapsed -->
          <v-tooltip v-if="rail" location="right">
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                :prepend-icon="item.icon"
                :title="item.title"
                :value="item.value"
                :to="item.route"
                :active-class="'selected-item'"
                @click="setActiveItem(item.route)"
                :class="{ 'selected-item': activeItem === item.route }"
              />
            </template>
            <span>{{ item.title }}</span>
          </v-tooltip>

          <!-- No tooltip when rail is expanded -->
          <v-list-item
            v-else
            :prepend-icon="item.icon"
            :title="item.title"
            :value="item.value"
            :to="item.route"
            :active-class="'selected-item'"
            @click="setActiveItem(item.route)"
            :class="{ 'selected-item': activeItem === item.route }"
          />
        </template>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<style>
.selected-item {
  background-color: #385f73;
  color: #eee; /* Replace with your desired color */
}
</style>
