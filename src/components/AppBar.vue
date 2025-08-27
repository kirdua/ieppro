<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import useUserStore from '@/stores/user'
import useChildrenStore from '@/stores/children'
import useServicesStore from '@/stores/services'
import useGoalsStore from '@/stores/goals'
import useNotesStore from '@/stores/notes'

import AddButton from './button/AddButton.vue'

/** Router */
const router = useRouter()
const route = useRoute()

/** Stores */
const userStore = useUserStore()
const childrenStore = useChildrenStore()
const servicesStore = useServicesStore()
const goalsStore = useGoalsStore()
const notesStore = useNotesStore()

/** Keep state reactive when pulling from Pinia stores */
const { userInfo } = storeToRefs(userStore)

/** Derived page title from route meta (works on refresh) */
const currentTitle = computed(() => route.meta?.header ?? '')

/** Actions */
const goToProfile = () => router.push('/user')
const logoutHandler = async () => {
  await userStore.logout()
  router.push('/login')
}

const handleAddScheduledServices = () => {
  servicesStore.toggleAddScheduledServicesModal()
}
const handleAddGoals = () => {
  goalsStore.toggleAddGoalsModal()
}

const handleAddNote = () => {
  // Future implementation for adding notes
  notesStore.showEditor = true
}

/** Menu items */
const items = [
  { title: 'Profile', action: goToProfile, icon: 'mdi-account' },
  { title: 'Logout', action: logoutHandler, icon: 'mdi-logout' }
]
</script>

<template>
  <v-app-bar flat class="justify-end dropshadow">
    <template #prepend>
      <h3 class="text-primary">{{ currentTitle }}</h3>
    </template>

    <v-app-bar-title />
    <v-spacer />

    <!-- Add buttons shown conditionally by title -->
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
      :buttonText="'Add Goal'"
      :handleClick="handleAddGoals"
    />

    <add-button
      v-if="currentTitle === 'Notes'"
      :buttonText="'Add Note'"
      :handleClick="handleAddNote"
    />

    <!-- User menu -->
    <v-menu open-on-hover class="justify-end">
      <template #activator="{ props }">
        <v-btn icon v-bind="props" aria-label="User menu">
          <v-avatar v-if="userInfo?.profilePicUrl" size="40">
            <img :src="userInfo.profilePicUrl" alt="Profile Picture" />
          </v-avatar>
          <v-icon v-else color="primary">mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="item.action"
          class="cursor-pointer"
        >
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
  align-items: center;
}

.v-avatar img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.dropshadow {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}
</style>
