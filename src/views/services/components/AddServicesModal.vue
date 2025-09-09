<script setup>
import { ref } from 'vue'
import { semesterOptions, locationOptions, progressGradedByOptions } from '@/constants'
import useServicesStore from '@/stores/services'

const props = defineProps({
  selectedChildId: String,
  currentGrade: String
})
const emit = defineEmits(['service-added'])

const servicesStore = useServicesStore()

const step = ref(1)
const items = ['Add Service', 'Review Service', 'Submit Service']

// Form fields
const selectedSemester = ref(null)
const year = ref('')
const course = ref('')
const location = ref('')
const genEdModified = ref(true)
const genEdTime = ref('')
const specialEdTime = ref('')
const progressGradedBy = ref('')
const startDate = ref('')
const endDate = ref('')

// Save state
const isSaving = ref(false)
const saveStatus = ref(null)

const formRef = ref(null)

const resetForm = () => {
  selectedSemester.value = null
  year.value = ''
  course.value = ''
  location.value = ''
  genEdModified.value = true
  genEdTime.value = ''
  specialEdTime.value = ''
  progressGradedBy.value = ''
  startDate.value = ''
  endDate.value = ''
  step.value = 1
  saveStatus.value = null
}

const closeModal = () => {
  servicesStore.toggleAddScheduledServicesModal()
  resetForm()
}

const submitScheduledServices = async () => {
  isSaving.value = true
  saveStatus.value = null

  if (
    !selectedSemester.value ||
    !year.value ||
    !course.value ||
    !location.value ||
    !startDate.value ||
    !endDate.value
  ) {
    saveStatus.value = 'Please fill in all required fields.'
    isSaving.value = false
    return
  }

  const newService = {
    childId: props.selectedChildId,
    gradeLevel: props.currentGrade,
    semester: selectedSemester.value,
    year: year.value,
    course: course.value,
    location: location.value,
    genEdModified: genEdModified.value,
    genEducationTime: genEdTime.value,
    specialEducationTime: specialEdTime.value,
    gradedBy: progressGradedBy.value,
    startDate: startDate.value,
    endDate: endDate.value
  }

  try {
    await servicesStore.addScheduledService(newService)

    saveStatus.value = 'Service successfully submitted!'
    emit('service-added')
    resetForm()
  } catch (error) {
    console.error(error)
    saveStatus.value = 'Failed to submit Service.'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <v-dialog v-model="servicesStore.addServiceModalVisible" max-width="900px" scrollable>
    <v-card class="rounded-xl" elevation="2" style="max-height: 100vh">
      <template #title>
        <div class="d-flex justify-space-between align-center px-2 py-1">
          <span class="text-primary text-h6 font-weight-bold">Add a Service</span>
          <v-tooltip text="Close Dialog" location="top">
            <template #activator="{ props }">
              <v-icon
                v-bind="props"
                size="20"
                color="grey-darken-1"
                class="cursor-pointer close-icon"
                @click="closeModal"
              >
                mdi-close
              </v-icon>
            </template>
          </v-tooltip>
        </div>
      </template>

      <v-stepper v-model="step" :items="items" show-actions color="primary" class="px-2 pb-2">
        <!-- Step 1: Form -->
        <template #item.1>
          <v-card-text class="pt-4">
            <v-form ref="formRef" validate-on="input">
              <v-row>
                <v-col cols="3">
                  <v-select
                    v-model="selectedSemester"
                    :items="semesterOptions"
                    label="Semester"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    prepend-inner-icon="mdi-timetable"
                    color="primary"
                  />
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="year"
                    label="Year"
                    placeholder="2023-2024"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    clearable
                    prepend-inner-icon="mdi-calendar-range"
                    color="primary"
                  />
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="course"
                    label="Course"
                    placeholder="Math, Reading, etc."
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    clearable
                    prepend-inner-icon="mdi-book-open-variant"
                    color="primary"
                  />
                </v-col>
                <v-col cols="3">
                  <v-select
                    v-model="location"
                    :items="locationOptions"
                    label="Location"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    prepend-inner-icon="mdi-map-marker-outline"
                    color="primary"
                  />
                </v-col>
              </v-row>

              <v-row class="mt-1">
                <v-col cols="3" class="d-flex align-center">
                  <v-checkbox
                    v-model="genEdModified"
                    label="Gen Ed Modified"
                    color="primary"
                    hide-details
                  />
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="genEdTime"
                    label="General Education Time"
                    placeholder="20"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    clearable
                    type="number"
                    min="0"
                    prepend-inner-icon="mdi-timer-outline"
                    color="primary"
                  />
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="specialEdTime"
                    label="Special Education Time"
                    placeholder="20"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    clearable
                    type="number"
                    min="0"
                    prepend-inner-icon="mdi-timer-sand"
                    color="primary"
                  />
                </v-col>
                <v-col cols="3">
                  <v-select
                    v-model="progressGradedBy"
                    label="Graded by"
                    :items="progressGradedByOptions"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    prepend-inner-icon="mdi-account-check-outline"
                    color="primary"
                  />
                </v-col>
              </v-row>

              <v-row class="mt-1">
                <v-col cols="6">
                  <v-text-field
                    v-model="startDate"
                    label="Start Date"
                    placeholder="01/01/2025"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    clearable
                    prepend-inner-icon="mdi-calendar-start"
                    color="primary"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="endDate"
                    label="End Date"
                    placeholder="01/01/2025"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    clearable
                    prepend-inner-icon="mdi-calendar-end"
                    color="primary"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </template>

        <!-- Step 2: Review -->
        <template #item.2>
          <v-card-text class="pt-4">
            <v-sheet rounded="lg" elevation="6" class="pa-4 bg-grey-lighten-5">
              <v-row>
                <v-col cols="6">
                  <div class="mb-3">
                    <span class="text-medium-emphasis font-weight-medium">Semester:</span>
                    <div>{{ selectedSemester || '—' }}</div>
                  </div>
                  <div class="mb-3">
                    <span class="text-medium-emphasis font-weight-medium">Course:</span>
                    <div>{{ course || '—' }}</div>
                  </div>
                  <div class="mb-3">
                    <span class="text-medium-emphasis font-weight-medium">Location:</span>
                    <div>{{ location || '—' }}</div>
                  </div>
                  <div>
                    <span class="text-medium-emphasis font-weight-medium">Start Date:</span>
                    <div>{{ startDate || '—' }}</div>
                  </div>
                </v-col>

                <v-col cols="6">
                  <div class="mb-3">
                    <span class="text-medium-emphasis font-weight-medium">Gen Ed Modified:</span>
                    <div>{{ genEdModified ? 'Yes' : 'No' }}</div>
                  </div>
                  <div class="mb-3">
                    <span class="text-medium-emphasis font-weight-medium">Gen Ed Time:</span>
                    <div>{{ genEdTime ? genEdTime + ' minutes' : '—' }}</div>
                  </div>
                  <div class="mb-3">
                    <span class="text-medium-emphasis font-weight-medium">SpEd Time:</span>
                    <div>{{ specialEdTime ? specialEdTime + ' minutes' : '—' }}</div>
                  </div>
                  <div class="mb-3">
                    <span class="text-medium-emphasis font-weight-medium">Graded By:</span>
                    <div>{{ progressGradedBy || '—' }}</div>
                  </div>
                  <div>
                    <span class="text-medium-emphasis font-weight-medium">End Date:</span>
                    <div>{{ endDate || '—' }}</div>
                  </div>
                </v-col>
              </v-row>
            </v-sheet>
          </v-card-text>
        </template>

        <!-- Step 3: Save -->
        <template #item.3>
          <v-card-text class="text-center pt-6">
            <div v-if="isSaving" class="text-medium-emphasis">Saving...</div>
            <div v-else-if="saveStatus === 'success'" class="text-success">
              <v-icon size="28" class="mb-1">mdi-check-circle</v-icon>
              {{ saveStatus }}
            </div>
            <div v-else-if="saveStatus === 'error'" class="text-error">
              <v-icon size="28" class="mb-1">mdi-alert-circle</v-icon>
              {{ saveStatus }}
            </div>
            <h3 class="mb-4 text-subtitle-1 font-weight-medium">
              Are you sure you want to submit this service?
            </h3>
            <v-btn
              variant="outlined"
              color="primary"
              class="mt-2"
              :loading="isSaving"
              :disabled="isSaving"
              @click="submitScheduledServices"
            >
              Submit Service
            </v-btn>
          </v-card-text>
        </template>
      </v-stepper>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.close-icon:hover {
  color: rgb(var(--v-theme-primary));
  transition: color 0.15s ease;
}
</style>
