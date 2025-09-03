<script setup>
import { computed, onMounted, watch, ref } from 'vue'
import useUserStore from '@/stores/user'
import useChildrenStore from '@/stores/children'
import useGoalsStore from '@/stores/goals'

import GoalsTable from './GoalsTable.vue'
import GoalsSidebar from './GoalsSidebar.vue'
import NoGoals from './NoGoals.vue'
import AddGoalModal from './components/AddGoalModal.vue'
import GoalDeleteDialog from './components/DeleteGoal.vue'

const userStore = useUserStore()
const childStore = useChildrenStore()
const goalsStore = useGoalsStore()

const { uid } = userStore.userInfo

// Sidebar + delete dialog state
const showSidebar = ref(false)
const selectedGoal = ref(null)
const deleteDialogVisible = ref(false)
const goalToDelete = ref(null)

const isLoading = ref(false)

// Read current selection from the AppBar via children store
const childId = computed(() => childStore.selectedChildProfile?.id || null)
const currentGrade = computed(() => childStore.selectedChildProfile?.gradeLevel || '')

// Open sidebar on row click
const handleGoalClick = (goal) => {
  selectedGoal.value = goal
  showSidebar.value = true
}

// Ensure we have children + a selection when landing directly on this page
onMounted(async () => {
  isLoading.value = true

  if (!childStore.children?.length && uid) {
    await childStore.getChildrenProfiles(uid)
  }

  // If nothing selected yet, default to first child (reuses your existing helper)
  if (!childStore.selectedChildProfile && childStore.children.length) {
    childStore.editChildProfile(childStore.children[0])
  }

  isLoading.value = false
})

// Keep goalsStore aware of the current selection
const updateCurrentChildProfile = () => {
  goalsStore.currentChildProfile = {
    id: childId.value,
    gradeLevel: currentGrade.value
  }
}

// Fetch goals whenever selection changes (and on first run)
const getGoals = async () => {
  if (!childId.value) return
  isLoading.value = true
  try {
    await goalsStore.getGoalsByGradeLevel({
      id: childId.value,
      gradeLevel: currentGrade.value
    })
  } catch (error) {
    console.error(error?.response?.data?.message || error)
  } finally {
    isLoading.value = false
  }
}

watch(
  [childId, currentGrade],
  () => {
    updateCurrentChildProfile()
    getGoals()
  },
  { immediate: true }
)

// Delete flow
const showDeleteDialog = (goal) => {
  goalToDelete.value = goal
  deleteDialogVisible.value = true
}
const closeDeleteDialog = () => {
  deleteDialogVisible.value = false
  goalToDelete.value = null
}
const deleteGoal = async () => {
  try {
    await goalsStore.deleteGoal(goalToDelete.value, childId.value, currentGrade.value)
    closeDeleteDialog()
    await getGoals()
  } catch (err) {
    console.error('Failed to delete goal:', err)
  }
}

// Save from sidebar
const handleGoalSave = async (updatedGoal) => {
  await goalsStore.updateGoal(updatedGoal)
  await getGoals()
}
</script>

<template>
  <div class="pa-4">
    <!-- Selectors removed: we rely on AppBar's global selection -->

    <div v-if="isLoading" class="text-center mt-4">
      <v-progress-circular indeterminate color="primary" />
      <div class="mt-2">Loading Goals...</div>
    </div>

    <div v-else-if="goalsStore.goals.length === 0">
      <NoGoals />
    </div>

    <div v-else>
      <GoalsTable
        :isLoading="isLoading"
        :items="goalsStore.goals"
        @row-clicked="handleGoalClick"
        @delete-goal="showDeleteDialog"
      />
    </div>

    <GoalsSidebar v-model:show="showSidebar" :goal="selectedGoal" @save="handleGoalSave" />

    <!-- Still pass the current selection to AddGoalModal -->
    <AddGoalModal :selectedChildId="childId" :currentGrade="currentGrade" @goal-added="getGoals" />

    <GoalDeleteDialog
      :goal="goalToDelete"
      :showDeleteDialog="deleteDialogVisible"
      @closeDeleteDialog="closeDeleteDialog"
      @confirmDelete="deleteGoal"
    />
  </div>
</template>
