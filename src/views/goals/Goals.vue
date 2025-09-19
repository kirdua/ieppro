<script setup>
import { computed, onMounted, ref } from 'vue'
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

// Sidebar + delete dialog state
const showSidebar = ref(false)
const selectedGoal = ref(null)
const deleteDialogVisible = ref(false)
const goalToDelete = ref(null)

// Read current selection from the AppBar via children store
const childId = computed(() => childStore.selectedChildProfile?.id || null)
const currentGrade = computed(() => childStore.selectedChildProfile?.gradeLevel || '')

// Open sidebar on row click
const handleGoalClick = (goal) => {
  selectedGoal.value = goal
  showSidebar.value = true
}

// Direct navigation fallback:
// If user lands on /goals without AppBar having pushed context yet,
// hydrate the store with a default "grade" view using current selection.
onMounted(async () => {
  // Ensure children are loaded if coming in cold
  if (!childStore.children?.length && userStore.userInfo?.uid) {
    await childStore.getChildrenProfiles(userStore.userInfo.uid)
  }
  // If still nothing selected, default to first child
  if (!childStore.selectedChildProfile && childStore.children.length) {
    childStore.editChildProfile(childStore.children[0])
  }

  // If the goals store doesn't yet know the context, seed it and fetch
  if (childId.value && !goalsStore.childContext) {
    if (typeof goalsStore.setContext === 'function') {
      goalsStore.setContext({
        viewMode: 'grade',
        subject: null,
        childId: childId.value,
        grade: currentGrade.value
      })
    }
    if (typeof goalsStore.refresh === 'function') {
      await goalsStore.refresh()
    }
  }
})

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
    await goalsStore.deleteGoal(goalToDelete.value)
    // Re-fetch using whatever context is active (grade or subject)
    if (typeof goalsStore.refresh === 'function') {
      await goalsStore.refresh()
    }
    closeDeleteDialog()
  } catch (err) {
    console.error('Failed to delete goal:', err)
  }
}

// Save from sidebar
const handleGoalSave = async (updatedGoal) => {
  await goalsStore.updateGoal(updatedGoal)
  if (typeof goalsStore.refresh === 'function') {
    await goalsStore.refresh()
  }
}
</script>

<template>
  <div class="pa-4">
    <div v-if="goalsStore.isLoading" class="text-center mt-4">
      <v-progress-circular indeterminate color="primary" />
      <div class="mt-2">Loading Goals...</div>
    </div>

    <div v-else-if="goalsStore.error">
      <v-alert type="error" variant="tonal" border="start" color="error" class="mb-4">
        {{ goalsStore.error }}
      </v-alert>
      <NoGoals />
    </div>

    <div v-else-if="goalsStore.goals.length === 0">
      <NoGoals />
    </div>

    <div v-else>
      <GoalsTable
        :isLoading="goalsStore.isLoading"
        :items="goalsStore.goals"
        @row-clicked="handleGoalClick"
        @delete-goal="showDeleteDialog"
      />
    </div>

    <GoalsSidebar
      v-model:show="showSidebar"
      :goal="selectedGoal"
      :view="goalsStore.viewMode"
      @save="handleGoalSave"
    />

    <AddGoalModal
      :selectedChildId="childId"
      :currentGrade="currentGrade"
      @goal-added="goalsStore.refresh && goalsStore.refresh()"
    />

    <GoalDeleteDialog
      :goal="goalToDelete"
      :showDeleteDialog="deleteDialogVisible"
      @closeDeleteDialog="closeDeleteDialog"
      @confirmDelete="deleteGoal"
    />
  </div>
</template>
