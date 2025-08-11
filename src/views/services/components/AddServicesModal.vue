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
  <v-dialog v-model="servicesStore.addServiceModalVisible" max-width="900px">
    <v-card style="max-height: 100vh">
      <template #title>
        <div class="d-flex justify-space-between align-center">
          <span class="text-primary">Add a Service</span>
          <v-tooltip text="Close Dialog" location="top">
            <template #activator="{ props }">
              <v-icon
                v-bind="props"
                size="18"
                color="grey"
                class="cursor-pointer"
                @click="servicesStore.toggleAddScheduledServicesModal"
              >
                mdi-close
              </v-icon>
            </template>
          </v-tooltip>
        </div>
      </template>

      <v-stepper v-model="step" :items="items" show-actions>
        <!-- Step 1: Form -->
        <template #item.1>
          <v-card-text>
            <v-form ref="formRef" validate-on="input">
              <v-row>
                <v-col cols="3">
                  <v-select v-model="selectedSemester" :items="semesterOptions" label="Semester" />
                </v-col>
                <v-col cols="3">
                  <v-text-field v-model="year" label="Year" placeholder="2023-2024" />
                </v-col>
                <v-col cols="3">
                  <v-text-field v-model="course" label="Course" placeholder="Math, Reading, etc." />
                </v-col>
                <v-col cols="3">
                  <v-select v-model="location" :items="locationOptions" label="Location" />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="3">
                  <v-checkbox v-model="genEdModified" label="Gen Ed Modified" color="primary" />
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="genEdTime"
                    label="General Education Time"
                    placeholder="20"
                  />
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="specialEdTime"
                    label="Special Education Time"
                    placeholder="20"
                  />
                </v-col>
                <v-col cols="3">
                  <v-select
                    v-model="progressGradedBy"
                    label="Graded by"
                    :items="progressGradedByOptions"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="6">
                  <v-text-field v-model="startDate" label="Start Date" placeholder="01/01/2025" />
                </v-col>
                <v-col cols="6">
                  <v-text-field v-model="endDate" label="End Date" placeholder="01/01/2025" />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </template>

        <!-- Step 2: Review -->
        <template #item.2>
          <v-card-text>
            <h5 class="mb-4">Review Your Service Information</h5>
            <v-row>
              <v-col cols="6">
                <strong>Semester:</strong> {{ selectedSemester }}<br />
                <strong>Course:</strong> {{ course }}<br />
                <strong>Location:</strong> {{ location }}<br />
                <strong>Start Date:</strong> {{ startDate }}<br />
              </v-col>
              <v-col cols="6">
                <strong>Gen Ed Modified:</strong> {{ genEdModified ? 'Yes' : 'No' }}<br />
                <strong>Gen Ed Time:</strong> {{ genEdTime }} minutes<br />
                <strong>SpEd Time:</strong> {{ specialEdTime }} minutes<br />
                <strong>Graded By:</strong> {{ progressGradedBy }}<br />
                <strong>End Date:</strong> {{ endDate }}
              </v-col>
            </v-row>
          </v-card-text>
        </template>

        <!-- Step 3: Save -->
        <template #item.3>
          <v-card-text class="text-center">
            <div v-if="isSaving">Saving...</div>
            <div v-else-if="saveStatus === 'success'" class="text-success">
              <v-icon>mdi-check-circle</v-icon>
              {{ saveStatus }}
            </div>
            <div v-else-if="saveStatus === 'error'" class="text-error">
              {{ saveStatus }}
            </div>
            <h3 class="mb-4">Are you sure you want to submit this service?</h3>
            <v-btn
              variant="outlined"
              color="primary"
              class="mt-4"
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
