<script setup>
import { ref } from 'vue'

const calendar = ref()
const today = ref(new Date())
const events = ref([])

const colorOptions = [
  'blue',
  'indigo',
  'deep-purple',
  'cyan',
  'green',
  'orange',
  'pink',
  'teal',
  'purple',
  'red',
  'grey darken-1'
]
const dayOptions = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 }
]

const addDialog = ref(false)
const formRef = ref(null)
const form = ref({
  title: '',
  teacher: '',
  location: '',
  color: 'blue',
  startDate: null,
  endDate: null,
  daysOfWeek: [],
  startTime: null,
  durationMinutes: 45
})

const rules = {
  required: (v) => !!v || 'Required',
  min1: (v) => (Array.isArray(v) && v.length > 0) || 'Pick at least one',
  positive: (v) => Number(v) > 0 || 'Must be > 0',
  dateOrder: () => {
    if (!form.value.startDate || !form.value.endDate) return true
    return (
      new Date(form.value.startDate) <= new Date(form.value.endDate) ||
      'End date must be after start date'
    )
  }
}

function generateClassEventsFromForm(f) {
  const out = []
  if (!f.startDate || !f.endDate || !f.daysOfWeek?.length || !f.startTime) return out

  const startDate = ymdToDate(f.startDate)
  const endDate = ymdToDate(f.endDate)
  const [h, m] = parseHHMM(f.startTime)

  for (let d = new Date(startDate); d <= endDate; d = addDays(d, 1)) {
    if (!f.daysOfWeek.includes(d.getDay())) continue

    const start = new Date(d)
    start.setHours(h, m, 0, 0)

    const end = new Date(start.getTime() + Number(f.durationMinutes) * 60 * 1000)

    out.push({
      title: f.title || 'Class',
      start,
      end,
      color: f.color || 'blue',
      allDay: false,
      location: f.location || '',
      teacher: f.teacher || '',
      type: 'class'
    })
  }

  return out
}

function ymdToDate(ymd) {
  const [Y, M, D] = ymd.split('-').map(Number)
  return new Date(Y, M - 1, D)
}
function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}
function parseHHMM(hhmm) {
  const [hh, mm] = String(hhmm).split(':').map(Number)
  return [hh || 0, mm || 0]
}

async function handleAddClassSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  const classEvents = generateClassEventsFromForm(form.value)
  events.value = [...events.value, ...classEvents]

  addDialog.value = false
  resetForm()
}

function resetForm() {
  form.value = {
    title: '',
    teacher: '',
    location: '',
    color: 'blue',
    startDate: null,
    endDate: null,
    daysOfWeek: [],
    startTime: null,
    durationMinutes: 45
  }
}
</script>

<template>
  <v-container class="pa-4 fill-height">
    <v-row class="fill-height">
      <v-col>
        <div class="d-flex align-center justify-space-between mb-3">
          <h2 class="text-h5">Child Schedule</h2>
          <v-btn color="primary" variant="flat" @click="addDialog = true">
            <v-icon start>mdi-plus</v-icon>
            Add Class
          </v-btn>
        </div>

        <v-sheet height="300" rounded="xl" class="pa-2">
          <v-calendar
            ref="calendar"
            v-model="today"
            :events="events"
            type="month"
            event-color="color"
          />
        </v-sheet>
      </v-col>
    </v-row>

    <!-- Add Class Dialog -->
    <v-dialog v-model="addDialog" max-width="640">
      <v-card rounded="xl">
        <v-card-title class="text-h6">Add Class</v-card-title>
        <v-divider />
        <v-card-text>
          <v-form ref="formRef" validate-on="input">
            <v-row>
              <v-col cols="12" md="7">
                <v-text-field
                  v-model="form.title"
                  label="Class title"
                  :rules="[rules.required]"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" md="5">
                <v-select
                  v-model="form.color"
                  :items="colorOptions"
                  label="Color"
                  hide-details="auto"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model="form.teacher" label="Teacher" hide-details="auto" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="form.location" label="Location" hide-details="auto" />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.startDate"
                  label="Start date"
                  type="date"
                  :rules="[rules.required]"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.endDate"
                  label="End date"
                  type="date"
                  :rules="[rules.required, rules.dateOrder]"
                  hide-details="auto"
                />
              </v-col>

              <v-col cols="12">
                <v-btn-toggle
                  v-model="form.daysOfWeek"
                  multiple
                  class="w-100"
                  rounded="lg"
                  variant="tonal"
                  color="primary"
                  density="comfortable"
                >
                  <v-btn v-for="d in dayOptions" :key="d.value" :value="d.value" class="flex-1">{{
                    d.label
                  }}</v-btn>
                </v-btn-toggle>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.startTime"
                  label="Start time"
                  type="time"
                  :rules="[rules.required]"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="form.durationMinutes"
                  label="Duration (minutes)"
                  type="number"
                  min="1"
                  step="5"
                  :rules="[rules.required, rules.positive]"
                  hide-details="auto"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider />
        <v-card-actions class="px-4 pb-4">
          <v-spacer />
          <v-btn variant="text" @click="addDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="handleAddClassSubmit"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.flex-1 {
  flex: 1 1 0;
}
</style>
