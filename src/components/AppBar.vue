<script setup>
import { onMounted, computed, watch, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { gradeLevels } from '@/utils/child-options'
import { goalSubjects } from '@/constants' // strings or objects both supported

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

/** Store refs */
const { userInfo } = storeToRefs(userStore)
const { children, selectedChildProfile } = storeToRefs(childrenStore)

/** Title */
const currentTitle = computed(() => route.meta?.header ?? '')

/** Child options */
const childOptions = computed(() =>
  (children.value || []).map((c) => ({
    id: c.id,
    name: c.name || [c.firstName, c.lastName].filter(Boolean).join(' ')
  }))
)

/** Load children + select first if none */
const loadChildrenIfNeeded = async () => {
  if (!userInfo.value?.uid) return
  if (!childrenStore.children || childrenStore.children.length === 0) {
    await childrenStore.getChildrenProfiles(userInfo.value.uid)
  }
  if (!selectedChildProfile.value && childrenStore.children.length > 0) {
    childrenStore.editChildProfile(childrenStore.children[0])
  }
}
onMounted(loadChildrenIfNeeded)
watch(
  () => userInfo.value?.uid,
  async (uid) => {
    if (uid) await loadChildrenIfNeeded()
  }
)

/** v-model: child */
const childModel = computed({
  get: () => selectedChildProfile.value?.id ?? null,
  set: (childId) => {
    if (!childId) {
      childrenStore.selectedChildProfile = null
      return
    }
    const picked = childrenStore.children.find((c) => c.id === childId) || null
    if (picked) childrenStore.editChildProfile(picked)
  }
})

/** v-model: grade (in-memory only) */
const gradeModel = computed({
  get: () => selectedChildProfile.value?.gradeLevel ?? '',
  set: (grade) => {
    if (!selectedChildProfile.value) return
    childrenStore.selectedChildProfile = { ...selectedChildProfile.value, gradeLevel: grade || '' }
  }
})

/** View-by + subject selection */
const viewBy = ref('grade') // 'grade' | 'subject'
const subject = ref(null) // string | null

/** Normalize subjects to { title, value } regardless of input shape */
const subjectItems = computed(() => {
  const src = goalSubjects || []
  return src.map((s) => {
    if (typeof s === 'string') {
      const title = s === 'ELA' ? 'ELA (English/Language Arts)' : s
      return { title, value: s }
    }
    const label = s.label ?? s.title ?? s.value ?? ''
    const value = s.value ?? s.label ?? s.title ?? ''
    const title =
      value === 'ELA' || (label && label.includes('ELA'))
        ? label || 'ELA (English/Language Arts)'
        : label || String(value)
    return { title, value }
  })
})

/** Push context to goals store whenever child/grade/subject/view changes */
watch(
  () => [
    viewBy.value,
    subject.value,
    selectedChildProfile.value?.id,
    selectedChildProfile.value?.gradeLevel
  ],
  async () => {
    const childId = selectedChildProfile.value?.id ?? null
    const grade = selectedChildProfile.value?.gradeLevel ?? ''
    if (!childId) return

    if (typeof goalsStore.setContext === 'function') {
      goalsStore.setContext({
        viewMode: viewBy.value,
        subject: viewBy.value === 'subject' ? subject.value : null,
        childId,
        grade
      })
      if (typeof goalsStore.refresh === 'function') {
        await goalsStore.refresh()
      }
    } else {
      // fallback to old behavior (grade-only)
      if (viewBy.value === 'grade' && typeof goalsStore.getGoalsByGradeLevel === 'function') {
        await goalsStore.getGoalsByGradeLevel({ id: childId, gradeLevel: grade })
      }
    }
  },
  { immediate: true }
)

/** Actions */
const goToProfile = () => router.push('/user')
const logoutHandler = async () => {
  await userStore.logout()
  router.push('/login')
}
const handleAddScheduledServices = () => servicesStore.toggleAddScheduledServicesModal()
const handleAddGoals = () => goalsStore.toggleAddGoalsModal()
const handleAddNote = () => (notesStore.noteModalIsVisible = true)
const handleAddClass = () => (notesStore.noteModalIsVisible = true)

/** User menu */
const items = [
  { title: 'Profile', action: goToProfile, icon: 'mdi-account' },
  { title: 'Logout', action: logoutHandler, icon: 'mdi-logout' }
]
</script>

<template>
  <v-app-bar flat class="dropshadow" :height="64">
    <template #prepend>
      <h3 class="text-primary">{{ currentTitle }}</h3>
    </template>

    <v-app-bar-title />
    <v-spacer />

    <!-- Context selectors -->
    <div
      v-if="!['Overview', 'Children Profiles'].includes(currentTitle)"
      class="d-flex align-center ga-4 mr-5 h-100 mt-5"
    >
      <!-- Child -->
      <v-select
        label="Child"
        v-model="childModel"
        :items="childOptions"
        item-value="id"
        item-title="name"
        density="compact"
        variant="outlined"
        class="w-30 my-0"
        prepend-inner-icon="mdi-account-child"
        color="primary"
      />

      <!-- View by -->
      <v-select
        v-if="currentTitle === 'Goals'"
        label="View by"
        v-model="viewBy"
        :items="[
          { title: 'Grade', value: 'grade' },
          { title: 'Subject', value: 'subject' }
        ]"
        item-title="title"
        item-value="value"
        density="compact"
        variant="outlined"
        class="w-25 my-0"
        prepend-inner-icon="mdi-filter-variant"
        color="primary"
      />

      <!-- Grade -->
      <v-select
        v-if="viewBy === 'grade'"
        label="Grade Level"
        v-model="gradeModel"
        :items="gradeLevels"
        variant="outlined"
        density="compact"
        class="w-35 my-0"
        prepend-inner-icon="mdi-school"
        color="primary"
      />

      <!-- Subject -->
      <v-select
        v-else
        label="Subject"
        v-model="subject"
        :items="subjectItems"
        item-title="title"
        item-value="value"
        variant="outlined"
        density="compact"
        class="w-30 my-0"
        prepend-inner-icon="mdi-book-education-outline"
        color="primary"
      />
    </div>

    <!-- Add buttons -->
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
      :disabled="viewBy === 'subject'"
    />
    <add-button
      v-if="currentTitle === 'Notes'"
      :buttonText="'Add Note'"
      :handleClick="handleAddNote"
    />
    <add-button
      v-if="currentTitle === 'Class Schedule'"
      :buttonText="'Add Class'"
      :handleClick="handleAddClass"
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

/* Center controls vertically within the app bar */
.appbar-controls {
  align-items: center;
  height: 100%;
}

/* Neutralize vertical spacing inside inputs/buttons in the app bar */
.appbar-controls .v-select,
.appbar-controls .v-btn,
.appbar-controls .v-chip {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  align-self: center;
}

/* Offset Vuetify's internal field wrapper */
.appbar-controls .v-field {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  align-self: center;
}

/* Keep inputs balanced inside a 64px app bar */
.appbar-controls .v-select :deep(.v-field__input) {
  min-height: 38px;
}
</style>
