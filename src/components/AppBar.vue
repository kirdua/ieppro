<script setup>
import { watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import useUserStore from '@/stores/user'
import useChildrenStore from '@/stores/children'
import useServicesStore from '@/stores/services'
import useGoalsStore from '@/stores/goals'

import AddButton from './button/AddButton.vue'

const router = useRouter()
const userStore = useUserStore()
const childrenStore = useChildrenStore()
const servicesStore = useServicesStore()
const goalsStore = useGoalsStore()

const { logout, userInfo } = userStore

const currentTitle = ref('')

const goToProfile = () => {
  router.push('/user')
}

const goToIepUpload = () => {
  router.push({ name: 'iepupload' })
}

const logoutHandler = async () => {
  await logout()
  router.push('/login')
}

const items = [
  { title: 'Profile', action: goToProfile, icon: 'mdi-account' },
  { title: 'Upload IEP', action: goToIepUpload, icon: 'mdi-file-upload' },
  { title: 'Logout', action: logoutHandler, icon: 'mdi-logout' }
]

// Watch for route changes and update the page title accordingly
watch(
  () => router.currentRoute.value,
  (to, from) => {
    currentTitle.value = to.meta.header
  }
)

const handleAddScheduledServices = () => {
  const currentChildProfile = servicesStore.currentChildProfile.value
  const { id, gradeLevel } = currentChildProfile
  router.push({ name: 'add-services', query: { id, grade: gradeLevel } })
}

const handleAddGoals = () => {
  const currentChildProfile = goalsStore.currentChildProfile
  const { id, gradeLevel } = currentChildProfile
  router.push({ name: 'add-goals', query: { id, grade: gradeLevel } })
}
</script>

<template>
  <v-app-bar flat class="justify-end dropshadow">
    <template v-slot:prepend>
      <h3>{{ currentTitle }}</h3>
    </template>

    <v-app-bar-title></v-app-bar-title>
    <v-spacer></v-spacer>

    <add-button
      v-if="currentTitle === 'Children Profiles'"
      :buttonText="'Add Child'"
      :handleClick="childrenStore.toggleModal"
    />

    <add-button
      v-if="currentTitle === 'Scheduled Services'"
      :buttonText="'Add Scheduled Services'"
      :handleClick="handleAddScheduledServices"
    />

    <add-button
      v-if="currentTitle === 'Goals'"
      :buttonText="'Add Goals'"
      :handleClick="handleAddGoals"
    />

    <v-menu open-on-hover class="justify-end">
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props">
          <v-avatar size="40" v-if="userInfo?.profilePicUrl">
            <img :src="userInfo.profilePicUrl" alt="Profile Picture" />
          </v-avatar>
          <v-icon v-else color="primary">mdi-dots-vertical</v-icon>
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

.v-avatar img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>
