<!-- src/components/AppBar.vue -->
<script setup>
import { onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { gradeLevels } from '@/utils/child-options'

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

/** Reactive refs from stores */
const { userInfo } = storeToRefs(userStore)
const { children, selectedChildProfile } = storeToRefs(childrenStore)

/** Derived page title from route meta */
const currentTitle = computed(() => route.meta?.header ?? '')

/** Build child options locally (no store changes) */
const childOptions = computed(() =>
  (children.value || []).map((c) => ({
    id: c.id,
    name: c.name || [c.firstName, c.lastName].filter(Boolean).join(' ')
  }))
)

/** Ensure children are loaded when user is ready */
const loadChildrenIfNeeded = async () => {
  if (!userInfo.value?.uid) return
  if (!childrenStore.children || childrenStore.children.length === 0) {
    await childrenStore.getChildrenProfiles(userInfo.value.uid)
  }
  // If there’s no selection yet, auto-select first child
  if (!selectedChildProfile.value && childrenStore.children.length > 0) {
    const first = childrenStore.children[0]
    childrenStore.editChildProfile(first) // reuse your existing setter pattern
  }
}

onMounted(loadChildrenIfNeeded)

watch(
  () => userInfo.value?.uid,
  async (uid) => {
    if (uid) await loadChildrenIfNeeded()
  }
)

/** v-model for Child: maps to selectedChildProfile.id */
const childModel = computed({
  get: () => selectedChildProfile.value?.id ?? null,
  set: (childId) => {
    if (!childId) {
      // clear selection
      childrenStore.selectedChildProfile = null
      return
    }
    const picked = childrenStore.children.find((c) => c.id === childId) || null
    // use your existing method so any UI state stays consistent
    if (picked) childrenStore.editChildProfile(picked)
  }
})

/** v-model for Grade:
 *  We map to selectedChildProfile.gradeLevel so other pages reading the store
 *  still “see” the same grade selection. (This does NOT persist to Firestore.)
 */
const gradeModel = computed({
  get: () => selectedChildProfile.value?.gradeLevel ?? '',
  set: (grade) => {
    if (!selectedChildProfile.value) return
    // Shallow merge gradeLevel into the selectedChildProfile (in-memory only)
    childrenStore.selectedChildProfile = {
      ...selectedChildProfile.value,
      gradeLevel: grade || ''
    }
  }
})

/** Actions */
const goToProfile = () => router.push('/user')
const logoutHandler = async () => {
  await userStore.logout()
  router.push('/login')
}
const handleAddScheduledServices = () => servicesStore.toggleAddScheduledServicesModal()
const handleAddGoals = () => goalsStore.toggleAddGoalsModal()
const handleAddNote = () => (notesStore.noteModalIsVisible = true)

/** User menu */
const items = [
  { title: 'Profile', action: goToProfile, icon: 'mdi-account' },
  { title: 'Logout', action: logoutHandler, icon: 'mdi-logout' }
]
</script>

<template>
  <v-app-bar flat class="justify-end dropshadow">
    <template #prepend>
      <h3 class="text-primary">
        {{ currentTitle }}
      </h3>
    </template>

    <v-app-bar-title />
    <v-spacer />

    <!-- Wrap selectors in a flex box to center them -->
    <div
      v-if="!['Overview', 'Children Profiles'].includes(currentTitle)"
      class="d-flex justify-center align-center ga-4 mt-5 mr-5"
    >
      <v-select
        label="Child"
        v-model="childModel"
        :items="childOptions"
        item-value="id"
        item-title="name"
        density="compact"
        variant="outlined"
        class="w-35"
        prepend-inner-icon="mdi-account-child"
        color="primary"
      />
      <v-select
        label="Grade Level"
        v-model="gradeModel"
        :items="gradeLevels"
        variant="outlined"
        density="compact"
        class="w-35"
        prepend-inner-icon="mdi-school"
        color="primary"
      />
    </div>

    <!-- Add buttons shown conditionally by title -->
    <add-button
      v-if="currentTitle === 'Children Profiles'"
      :buttonText="'Add Child'"
      :handleClick="childrenStore.toggleModal"
    />
    <add-button
      v-if="currentTitle === 'Scheduled Services'"
      :buttonText="'Add Scheduled Service'"
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
            <v-img :src="userInfo.profilePicUrl" alt="Profile Picture" cover />
          </v-avatar>
          <v-icon v-else color="primary">mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          :prepend-icon="item.icon"
          :title="item.title"
          @click="item.action"
          class="cursor-pointer"
        />
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<style scoped>
.v-avatar img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
.dropshadow {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}
</style>
