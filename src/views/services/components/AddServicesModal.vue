<script setup>
import { ref } from 'vue'
import { semesterOptions, locationOptions, progressGradedByOptions } from '@/constants'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import useServicesStore from '@/stores/services'

const props = defineProps({
  selectedChildId: String,
  currentGrade: String
})

const servicesStore = useServicesStore()

const step = ref(1)
const items = ['Add Service', 'Review Service', 'Submit Service']

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

const clearServicesForms = () => {
  selectedSemester.value = null
  year.value = ''
  course.value = ''
  location.value = ''
  genEdModified.value = true
  genEdTime.value = ''
  specialEdTime.value = ''
  progressGradedBy.value = ''
  startDate.value = null
  endDate.value = null
}

const submitScheduledServices = async () => {
  // const newService = {
  //   childId: props.selectedChildId,
  //   gradeLevel: props.currentGrade,
  //   semester: selectedSemester.value,
  //   year: year.value,
  //   course: course.value,
  //   location: location.value,
  //   genEdModified: genEdModified.value,
  //   genEducationTime: genEdTime.value,
  //   specialEducationTime: specialEdTime.value,
  //   gradedBy: progressGradedBy.value,
  //   startDate: startDate.value,
  //   endDate: endDate.value
  // }
  // try {
  //   await servicesStore.addScheduledService(newService)
  //   toast.success('Service added')
  //   clearServicesForms()
  //   servicesStore.toggleAddScheduledServicesModal()
  // } catch (error) {
  //   console.error(error)
  //   toast.error('Failed to add service')
  // }
}

const formatStartDate = (date) => {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  const currentDate = `${month}/${day}/${year}`
  startDate.value = currentDate
  return `Start date will be ${month}/${day}/${year}`
}

const formatEndDate = (date) => {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  const currentDate = `${month}/${day}/${year}`
  endDate.value = currentDate
  return `End date will be ${currentDate}`
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
        <template #item.1>
          <v-card-text>
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
                <v-text-field v-model="genEdTime" label="Gen Ed Time" placeholder="20" />
              </v-col>
              <v-col cols="3">
                <v-text-field v-model="specialEdTime" label="SpEd Time" placeholder="20" />
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
                <VueDatePicker
                  v-model="startDate"
                  placeholder="Start Date"
                  :format="formatStartDate"
                  :teleport="true"
                >
                  <template #time-picker> </template>
                  <template #action-buttons> </template>
                </VueDatePicker>
              </v-col>
              <v-col cols="6">
                <VueDatePicker
                  v-model="endDate"
                  placeholder="End Date"
                  :format="formatEndDate"
                  :teleport="true"
                >
                  <template #time-picker> </template>
                  <template #action-buttons> </template>
                </VueDatePicker>
              </v-col>
            </v-row>
          </v-card-text>
        </template>

        <template #item.2>
          <v-card-text>
            <h5 class="mb-4">Review Your Service Information</h5>
            <v-row>
              <v-col cols="6">
                <strong>Semester:</strong> {{ selectedSemester }}<br />
                <strong>Year:</strong> {{ year }}<br />
                <strong>Course:</strong> {{ course }}<br />
                <strong>Location:</strong> {{ location }}<br />
                <strong>Start Date:</strong> {{ startDate }}<br />
              </v-col>

              <v-col cols="6">
                <strong>Gen Ed Modified:</strong> {{ genEdModified ? 'Yes' : 'No' }}<br />
                <strong>Gen Ed Time:</strong> {{ genEdTime }} minutes<br />
                <strong>SpEd Time:</strong> {{ specialEdTime }} minutes<br />
                <strong>Graded By:</strong> {{ progressGradedBy }}<br />
                <strong>End Date:</strong>
                {{ endDate }}
              </v-col>
            </v-row>
          </v-card-text>
        </template>

        <template #item.3>
          <v-card-text class="text-center">
            <v-btn variant="outlined" color="primary" @click="submitScheduledServices">
              Submit Service
            </v-btn>
          </v-card-text>
        </template>
      </v-stepper>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.dp__menu {
  top: 100px !important;
  left: 300px !important;
}
</style>
