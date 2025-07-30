<script setup>
import { ref, onMounted, watch } from 'vue'
import { gradeLevels } from '@/utils/child-options'
import useUserStore from '@/stores/user'
import useChildrenStore from '@/stores/children'
import useGoalsStore from '@/stores/goals'

import GoalsTable from './GoalsTable.vue'
import GoalsSidebar from '../goals/GoalsSidebar.vue'
import NoGoals from './NoGoals.vue'

const userStore = useUserStore()
const childStore = useChildrenStore()
const goalsStore = useGoalsStore()

const { uid } = userStore.userInfo

const currentGrade = ref('')
const selectedChildId = ref(null)
const childOptions = ref([])
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  await childStore.getChildrenProfiles(uid)
  if (childStore.children.length > 0) {
    childOptions.value = childStore.children.map((child) => ({
      name: child.name,
      id: child.id,
      gradeLevel: child.gradeLevel
    }))
    selectedChildId.value = childOptions.value[0].id
    currentGrade.value = childOptions.value[0].gradeLevel
  }

  updateCurrentChildProfile()
  isLoading.value = false
})

const updateCurrentChildProfile = () => {
  goalsStore.currentChildProfile = {
    id: selectedChildId.value,
    gradeLevel: currentGrade.value
  }
}

watch([selectedChildId, currentGrade], () => {
  updateCurrentChildProfile()
})

watch(
  () => [selectedChildId.value, currentGrade.value],
  () => {
    getGoals()
  }
)

const getGoals = async () => {
  isLoading.value = true
  const params = {
    id: selectedChildId.value,
    gradeLevel: currentGrade.value
  }

  try {
    await goalsStore.getGoalsByGradeLevel(params)
  } catch (error) {
    console.error(error?.response?.data?.message)
  }
  isLoading.value = false
}
</script>

<template>
  <div class="pa-4">
    <div class="d-flex w-100 flex-inline">
      <v-select
        label="Child"
        v-model="selectedChildId"
        :items="childOptions"
        item-value="id"
        item-title="name"
        variant="outlined"
        class="w-35 mr-5"
        :disabled="isLoading"
      ></v-select>
      <v-select
        label="Grade Level"
        v-model="currentGrade"
        :items="gradeLevels"
        variant="outlined"
        class="w-35"
        :disabled="isLoading"
      ></v-select>
    </div>
    <div v-if="isLoading" class="text-center mt-4">
      <v-progress-circular indeterminate color="primary" />
      <div class="mt-2">Loading Goals...</div>
    </div>

    <div v-else-if="!isLoading && goalsStore.goals.length === 0">
      <NoGoals />
    </div>
    <div v-else>
      <GoalsTable :isLoading="isLoading" :items="goalsStore.goals" />
    </div>
  </div>
</template>
