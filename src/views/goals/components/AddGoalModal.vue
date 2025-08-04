<script setup>
import { ref } from 'vue'
import useGoalsStore from '@/stores/goals'
import { progressGradedByOptions, goalTypeItems } from '@/constants'
import { v7 as uuidv7 } from 'uuid'

const goalsStore = useGoalsStore()
const props = defineProps(['selectedChildId', 'currentGrade'])
const emit = defineEmits(['goal-added'])

const step = ref(1)
const items = ['Add Goal', 'Review Goal', 'Submit Goal']

const goalFocus = ref('')
const goalType = ref(goalTypeItems[0])
const currentPerformance = ref('')
const duration = ref('')
const benchmarks = ref([''])
const currentImplementer = ref(progressGradedByOptions[1])
const _id = ref()
const isLoading = ref(false)
const submitSuccess = ref('')
const submitError = ref('')

const addBenchmark = () => benchmarks.value.push('')
const removeBenchmark = (index) => benchmarks.value.splice(index, 1)

const resetForm = () => {
  goalFocus.value = ''
  goalType.value = goalTypeItems[0]
  currentPerformance.value = ''
  duration.value = ''
  benchmarks.value = ['']
  currentImplementer.value = progressGradedByOptions[1]
  _id.value = ''
  step.value = 1
  submitSuccess.value = ''
  submitError.value = ''
}

const addGoal = async () => {
  try {
    isLoading.value = true
    submitSuccess.value = ''
    submitError.value = ''

    if (
      !goalFocus.value ||
      !currentPerformance.value ||
      benchmarks.value.length === 0 ||
      !goalType.value ||
      !duration.value
    ) {
      throw new Error('Please fill in all fields.')
    }

    const singleGoal = {
      goalFocus: goalFocus.value,
      goalType: goalType.value,
      currentPerformance: currentPerformance.value,
      duration: duration.value,
      benchmarks: benchmarks.value,
      implementer: currentImplementer.value,
      id: _id.value || uuidv7(),
      createdDate: new Date().toISOString()
    }

    const id = props.selectedChildId
    const gradeLevel = props.currentGrade
    if (!id || !gradeLevel) throw new Error('Child ID or Grade Level missing')

    const goalDoc = {
      ...singleGoal,
      studentId: id,
      gradeLevel: gradeLevel
    }

    await goalsStore.addGoal(goalDoc)

    submitSuccess.value = 'Goal successfully submitted!'
    emit('goal-added')
    resetForm()
    goalsStore.toggleAddGoalsModal()
  } catch (error) {
    console.error('Error adding goal:', error)
    submitError.value = error.message || 'Failed to submit goal.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <v-dialog v-model="goalsStore.addGoalsModalVisible" max-width="900">
    <v-card class="pa-4" style="max-height: 90vh">
      <!-- Header -->
      <template #title>
        <div class="d-flex justify-space-between align-center">
          <span class="text-primary">Add a Goal</span>
          <v-tooltip text="Close Dialog" location="top">
            <template #activator="{ props }">
              <v-icon
                v-bind="props"
                size="18"
                color="grey"
                class="cursor-pointer"
                @click="goalsStore.toggleAddGoalsModal"
              >
                mdi-close
              </v-icon>
            </template>
          </v-tooltip>
        </div>
      </template>

      <!-- Stepper -->
      <v-stepper v-model="step" :items="items" show-actions>
        <!-- Step 1: Form -->
        <template v-slot:item.1>
          <div style="max-height: 60vh; overflow-y: auto; padding-right: 12px">
            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Goal"
                  required
                  v-model="goalFocus"
                  placeholder="Math, Reading, etc..."
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-autocomplete
                  :items="goalTypeItems"
                  label="Goal Type"
                  auto-select-first
                  v-model="goalType"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field v-model="currentPerformance" label="Current performance" required />
              </v-col>

              <v-col cols="12">
                <v-text-field v-model="duration" label="Duration" />
              </v-col>

              <!-- Add Benchmark Button ABOVE the inputs -->
              <v-col cols="12" class="d-flex justify-end mb-2">
                <v-btn @click="addBenchmark">Add Benchmark</v-btn>
              </v-col>

              <!-- Benchmarks Input Fields -->
              <v-col cols="12" v-for="(benchmark, index) in benchmarks" :key="index">
                <v-text-field v-model="benchmarks[index]" label="Benchmark">
                  <template #append-inner>
                    <v-icon color="red" class="cursor-pointer" @click="removeBenchmark(index)">
                      mdi-close-circle
                    </v-icon>
                  </template>
                </v-text-field>
              </v-col>

              <v-col cols="12">
                <v-autocomplete
                  v-model="currentImplementer"
                  :items="progressGradedByOptions"
                  label="Implementer"
                />
              </v-col>
            </v-row>
          </div>
        </template>

        <!-- Step 2: Review -->
        <template v-slot:item.2>
          <h3>Review Goal</h3>
          <v-card-text>
            <p><strong>Goal Focus:</strong> {{ goalFocus }}</p>
            <p><strong>Goal Type:</strong> {{ goalType }}</p>
            <p><strong>Current Performance:</strong> {{ currentPerformance }}</p>
            <p><strong>Duration:</strong> {{ duration }}</p>
            <p><strong>Benchmarks:</strong></p>
            <ul>
              <li v-for="(benchmark, index) in benchmarks" :key="index">{{ benchmark }}</li>
            </ul>
            <p><strong>Implementer:</strong> {{ currentImplementer }}</p>
          </v-card-text>
        </template>

        <!-- Step 3: Submit -->
        <template v-slot:item.3>
          <h2 class="text-center">Submit Goal</h2>
          <v-card-text class="text-center">
            <div v-if="isLoading">
              <v-progress-circular indeterminate color="primary" />
              <div class="mt-2">Submitting Goal...</div>
            </div>

            <div v-else>
              <v-alert
                v-if="submitSuccess"
                type="success"
                class="mb-4"
                border="start"
                variant="tonal"
              >
                {{ submitSuccess }}
              </v-alert>

              <v-alert v-if="submitError" type="error" class="mb-4" border="start" variant="tonal">
                {{ submitError }}
              </v-alert>

              <h3 class="mb-4">Are you sure you want to submit this goal?</h3>
              <v-btn variant="outlined" color="primary" @click="addGoal">Submit Goal</v-btn>
            </div>
          </v-card-text>
        </template>
      </v-stepper>
    </v-card>
  </v-dialog>
</template>
