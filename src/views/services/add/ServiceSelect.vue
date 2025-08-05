<script setup>
import { ref } from 'vue'
import useServicesStore from '@/stores/services'
import { semesterOptions, locationOptions, progressGradedByOptions } from '@/constants'
import VueDatePicker from '@vuepic/vue-datepicker'
import { toast } from 'vue3-toastify'

const props = defineProps(['selectedChildId', 'currentGrade'])
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

const clearForm = () => {
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
}

const submitScheduledService = async () => {
  try {
    if (!props.selectedChildId || !props.currentGrade) {
      throw new Error('Missing child or grade')
    }

    const newService = {
      studentId: props.selectedChildId,
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
      endDate: endDate.value,
      createdDate: new Date().toISOString()
    }

    await servicesStore.addScheduledService(newService)

    toast.success('Service added successfully!')
    clearForm()
    servicesStore.toggleAddScheduledServicesModal()
  } catch (error) {
    console.error(error)
    toast.error(error.message || 'Failed to add service')
  }
}

const formatStartDate = (date) => {
  const d = new Date(date)
  startDate.value = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
}
const formatEndDate = (date) => {
  const d = new Date(date)
  endDate.value = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
}
</script>

<template>
  <div>
    <div class="d-flex justify-end pa-2">
      <v-btn text="Add Schedule" color="primary" ripple @click="sheet = !sheet"></v-btn>
      <v-btn
        text="Submit Schedule"
        color="primary"
        class="ml-2"
        ripple
        :disabled="!servicesScheduled"
        @click="submitScheduledServices"
      ></v-btn>
    </div>
    <v-row class="pa-2">
      <v-col cols="12">
        <v-data-table
          :headers="servicesHeaders"
          :items="servicesScheduled"
          :no-data-text="'Add Services to Schedule'"
        >
          <template #bottom></template>
        </v-data-table>
      </v-col>
    </v-row>
    <div class="text-center">
      <v-bottom-sheet v-model="sheet" inset>
        <v-card height="450">
          <v-card-text>
            <div class="d-flex justify-end pb-1">
              <v-btn variant="outline" color="error" @click="sheet = !sheet"> Close </v-btn>
            </div>

            <div>
              <v-row>
                <v-col cols="12"><h5>Add a Course:</h5></v-col>
              </v-row>
              <v-row>
                <v-col cols="3">
                  <v-select
                    v-model="selectedSemester"
                    :items="semesterOptions"
                    label="Select a Semester"
                  ></v-select>
                </v-col>
                <v-col cols="3">
                  <v-text-field v-model="year" label="Year" placeholder="2023-2024"></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="course"
                    label="Course/Cirriculum"
                    placeholder="Math, Language Arts, etc..."
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-select
                    v-model="location"
                    :items="locationOptions"
                    label="Select a Location"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col col="3">
                  <v-checkbox
                    v-model="genEdModified"
                    label="Gen Ed Modified"
                    color="primary"
                  ></v-checkbox>
                </v-col>
                <v-col col="3">
                  <v-text-field
                    v-model="genEdTime"
                    label="General Education Time"
                    placeholder="20"
                  ></v-text-field>
                </v-col>
                <v-col col="3">
                  <v-text-field
                    v-model="specialEdTime"
                    label="Special Education Time"
                    placeholder="20"
                  ></v-text-field>
                </v-col>
                <v-col col="3">
                  <v-select
                    v-model="progressGradedBy"
                    label="Progress/Graded determined by"
                    :items="progressGradedByOptions"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <VueDatePicker
                    v-model="startDate"
                    placeholder="Start Date"
                    :format="formatStartDate"
                  >
                    <template #time-picker> </template>
                    <template #action-buttons> </template>
                  </VueDatePicker>
                </v-col>
                <v-col cols="6">
                  <VueDatePicker v-model="endDate" placeholder="End Date" :format="formatEndDate">
                    <template #time-picker> </template>
                    <template #action-buttons> </template>
                  </VueDatePicker>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
          <v-card-actions class="d-flex justify-end pr-5">
            <v-btn text="Clear" ripple @click="clearServicesForms"></v-btn>
            <v-btn text="Add Course" color="primary" ripple @click="addCourse"></v-btn>
          </v-card-actions>
        </v-card>
      </v-bottom-sheet>
    </div>
  </div>
</template>
