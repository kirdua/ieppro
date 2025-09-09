<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import useGoalsStore from '@/stores/goals'
import { progressGradedByOptions } from '@/constants'
import { v7 as uuidv7 } from 'uuid'

const goalsStore = useGoalsStore()
const props = defineProps(['selectedChildId', 'currentGrade'])
const emit = defineEmits(['goal-added'])

// Stepper / UX
const step = ref(1)
const items = ['Add Goal', 'Review Goal', 'Submit Goal']
const isLoading = ref(false)
const submitSuccess = ref('')
const submitError = ref('')

// Form model
const goalSubject = ref('')
const goalFocus = ref('')
const currentPerformance = ref('')
const duration = ref('')
const benchmarks = ref([''])
const currentImplementer = ref(progressGradedByOptions?.[1] ?? '')
const _id = ref('')

// Validation
const formRef = ref()
const rules = {
  required: (v) =>
    (!!v && (Array.isArray(v) ? v.filter(Boolean).length : String(v).trim().length) > 0) ||
    'Required'
}

const canProceedStep1 = computed(() => {
  const hasBenchmarks =
    Array.isArray(benchmarks.value) &&
    benchmarks.value.map((b) => String(b).trim()).filter(Boolean).length > 0

  return Boolean(
    goalSubject.value &&
      currentImplementer.value &&
      duration.value &&
      goalFocus.value &&
      currentPerformance.value &&
      hasBenchmarks
  )
})

// Benchmarks UX
const addBenchmark = () => benchmarks.value.push('')
const removeBenchmark = (idx) => {
  benchmarks.value.splice(idx, 1)
  if (benchmarks.value.length === 0) benchmarks.value.push('')
}

// Reset
const resetForm = async () => {
  goalSubject.value = ''
  goalFocus.value = ''
  currentPerformance.value = ''
  duration.value = ''
  benchmarks.value = ['']
  currentImplementer.value = progressGradedByOptions?.[1] ?? ''
  _id.value = ''
  step.value = 1
  submitSuccess.value = ''
  submitError.value = ''
  await nextTick()
  formRef.value?.resetValidation?.()
}

// Close dialog helper (always reset)
const closeDialog = async () => {
  await resetForm()
  goalsStore.toggleAddGoalsModal()
}

// Also reset when dialog is closed via overlay/ESC or any external control
watch(
  () => goalsStore.addGoalsModalVisible,
  async (open) => {
    if (!open) {
      await resetForm()
    }
  }
)

// Step controls
const goNext = async () => {
  submitError.value = ''
  if (step.value === 1) {
    const valid = await formRef.value?.validate()
    if (!valid) return
  }
  step.value = Math.min(step.value + 1, 3)
}
const goBack = () => {
  submitError.value = ''
  step.value = Math.max(step.value - 1, 1)
}

// Submit
const addGoal = async () => {
  try {
    isLoading.value = true
    submitSuccess.value = ''
    submitError.value = ''

    if (!canProceedStep1.value) throw new Error('Please complete all required fields.')

    const singleGoal = {
      goalSubject: goalSubject.value.trim(),
      goalFocus: goalFocus.value.trim(),
      currentPerformance: currentPerformance.value.trim(),
      duration: duration.value.trim(),
      benchmarks: benchmarks.value.map((b) => String(b).trim()).filter(Boolean),
      implementer: currentImplementer.value,
      id: _id.value || uuidv7(),
      createdDate: new Date().toISOString()
    }

    const id = props.selectedChildId
    const gradeLevel = props.currentGrade
    if (!id || !gradeLevel) throw new Error('Child ID or Grade Level missing')

    const goalDoc = { ...singleGoal, studentId: id, gradeLevel }
    await goalsStore.addGoal(goalDoc)

    submitSuccess.value = 'Goal successfully submitted!'
    emit('goal-added')
    await closeDialog()
  } catch (error) {
    console.error('Error adding goal:', error)
    submitError.value = error?.message || 'Failed to submit goal.'
    step.value = 3
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <v-dialog
    v-model="goalsStore.addGoalsModalVisible"
    max-width="920"
    @update:model-value="
      (v) => {
        if (!v) resetForm()
      }
    "
  >
    <v-card class="rounded-2xl" style="max-height: 92vh; display: flex; flex-direction: column">
      <!-- Header -->
      <v-card-title class="py-4 bg-primary text-white">
        <div class="d-flex justify-space-between align-center w-100">
          <div>
            <div class="text-h6 font-weight-medium">Add Student Goal</div>
            <div class="text-body-2 opacity-80">
              Provide clear, measurable statements and checkpoints.
            </div>
          </div>

          <v-btn
            variant="text"
            color="white"
            icon="mdi-close"
            density="comfortable"
            @click="closeDialog"
            :aria-label="'Close dialog'"
          />
        </div>
      </v-card-title>

      <v-divider />

      <!-- Stepper -->
      <div class="pt-4 px-6">
        <v-stepper
          v-model="step"
          :items="items"
          color="primary"
          active-color="primary"
          flat
          hide-actions
        />
      </div>

      <!-- Content -->
      <v-card-text style="overflow: auto">
        <!-- Step 1: Form -->
        <template v-if="step === 1">
          <v-form ref="formRef" validate-on="input">
            <div class="text-subtitle-1 mb-2 text-primary">Goal Details</div>

            <v-sheet rounded="lg" class="pa-4 mb-4">
              <!-- Subject / Implementer / Duration -->
              <v-row dense>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="goalSubject"
                    label="Subject"
                    placeholder="e.g., Reading, Math"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    color="primary"
                    :rules="[rules.required]"
                    prepend-inner-icon="mdi-book-education-outline"
                    hint="Subject area this goal belongs to."
                    persistent-hint
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-autocomplete
                    v-model="currentImplementer"
                    :items="progressGradedByOptions"
                    label="Implementer"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    color="primary"
                    :rules="[rules.required]"
                    prepend-inner-icon="mdi-account-check-outline"
                    hint="Who is responsible for measuring progress?"
                    persistent-hint
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="duration"
                    label="Duration"
                    placeholder="e.g., Through Q3 (12 weeks)"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    color="primary"
                    :rules="[rules.required]"
                    prepend-inner-icon="mdi-timer-outline"
                    hint="How long will this goal be measured?"
                    persistent-hint
                  />
                </v-col>
              </v-row>

              <v-col cols="12">
                <v-textarea
                  v-model="goalFocus"
                  label="Goal focus"
                  variant="outlined"
                  density="comfortable"
                  rows="3"
                  auto-grow
                  clearable
                  color="primary"
                  :rules="[rules.required]"
                  prepend-inner-icon="mdi-bullseye-arrow"
                  hint="What outcome are you targeting?"
                  persistent-hint
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="currentPerformance"
                  label="Current performance"
                  variant="outlined"
                  density="comfortable"
                  rows="3"
                  auto-grow
                  clearable
                  color="primary"
                  :rules="[rules.required]"
                  prepend-inner-icon="mdi-clipboard-text-outline"
                  hint="Briefly describe the present level of performance."
                  persistent-hint
                />
              </v-col>
            </v-sheet>

            <!-- Benchmarks -->
            <div class="d-flex align-center justify-space-between mb-2">
              <div class="text-subtitle-1 text-primary">Benchmarks</div>
              <v-btn
                variant="tonal"
                color="secondary"
                prepend-icon="mdi-plus"
                @click="addBenchmark"
              >
                Add benchmark
              </v-btn>
            </div>

            <v-row dense>
              <v-col cols="12" v-for="(benchmark, index) in benchmarks" :key="`bm-${index}`">
                <v-text-field
                  v-model="benchmarks[index]"
                  variant="outlined"
                  density="comfortable"
                  label="Benchmark"
                  color="primary"
                  placeholder="Measurable checkpoint (e.g., 80% accuracy on retell)"
                  :rules="[rules.required]"
                  prepend-inner-icon="mdi-flag-outline"
                >
                  <template #append-inner>
                    <v-tooltip text="Remove benchmark" location="top">
                      <template #activator="{ props }">
                        <v-icon
                          v-bind="props"
                          class="cursor-pointer"
                          color="error"
                          @click="removeBenchmark(index)"
                        >
                          mdi-close-circle
                        </v-icon>
                      </template>
                    </v-tooltip>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </template>

        <!-- Step 2: Review -->
        <template v-else-if="step === 2">
          <v-alert type="info" variant="tonal" color="secondary" class="mb-4">
            Please confirm everything looks correct before submitting.
          </v-alert>

          <v-sheet class="pa-4 rounded-lg" border>
            <!-- Review fields -->
            <v-row>
              <v-col cols="12" md="4">
                <div class="text-caption text-medium-emphasis">Subject</div>
                <div class="text-body-1">{{ goalSubject || '—' }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="text-caption text-medium-emphasis">Implementer</div>
                <div class="text-body-1">{{ currentImplementer || '—' }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="text-caption text-medium-emphasis">Duration</div>
                <div class="text-body-1">{{ duration || '—' }}</div>
              </v-col>
              <v-col cols="12">
                <div class="text-caption text-medium-emphasis">Goal focus</div>
                <div class="text-body-1">{{ goalFocus || '—' }}</div>
              </v-col>
              <v-col cols="12">
                <div class="text-caption text-medium-emphasis">Current performance</div>
                <div class="text-body-1">{{ currentPerformance || '—' }}</div>
              </v-col>
              <v-col cols="12">
                <div class="text-caption text-medium-emphasis mb-1">Benchmarks</div>
                <v-chip-group column>
                  <v-chip
                    v-for="(b, i) in benchmarks"
                    :key="`rb-${i}`"
                    class="mb-1"
                    size="small"
                    variant="tonal"
                    color="secondary"
                  >
                    {{ b }}
                  </v-chip>
                </v-chip-group>
              </v-col>
            </v-row>
          </v-sheet>
        </template>

        <!-- Step 3: Submit -->
        <template v-else>
          <div class="text-center">
            <h3 class="mb-4 text-primary">Submit Goal</h3>

            <div v-if="isLoading" class="py-6">
              <v-progress-circular indeterminate size="28" color="primary" />
              <div class="mt-3 text-body-2">Submitting goal…</div>
            </div>

            <div v-else>
              <v-alert
                v-if="submitSuccess"
                type="success"
                class="mb-4"
                border="start"
                variant="tonal"
                color="success"
              >
                {{ submitSuccess }}
              </v-alert>

              <v-alert
                v-if="submitError"
                type="error"
                class="mb-4"
                border="start"
                variant="tonal"
                color="error"
              >
                {{ submitError }}
              </v-alert>

              <div class="mb-6 text-body-1">Are you sure you want to submit this goal?</div>

              <v-btn
                :disabled="!!submitSuccess"
                variant="elevated"
                color="primary"
                @click="addGoal"
                prepend-icon="mdi-check-circle"
              >
                Submit Goal
              </v-btn>
            </div>
          </div>
        </template>
      </v-card-text>

      <v-divider />

      <!-- Sticky Footer Actions -->
      <v-card-actions
        class="px-6 py-3"
        style="position: sticky; bottom: 0; background: var(--v-theme-surface)"
      >
        <v-spacer />
        <v-btn variant="text" color="default" @click="closeDialog"> Cancel </v-btn>
        <v-btn v-if="step > 1" variant="text" color="primary" @click="goBack"> Back </v-btn>
        <v-btn
          v-if="step < 3"
          :disabled="step === 1 && !canProceedStep1"
          color="primary"
          variant="tonal"
          @click="goNext"
        >
          Next
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
