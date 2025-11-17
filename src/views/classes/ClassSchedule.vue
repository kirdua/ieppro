<!-- src/views/schedule/ClassSchedule.vue -->
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useClassesStore } from '@/stores/classes'
//import DaySidebar from './components/DaySidebar.vue'
import AddClassDialog from './components/AddClassDialog.vue'

const route = useRoute()
const childId = computed(() => route.params.childId || '')
const gradeLevel = computed(() => route.params.gradeLevel || '')

const store = useClassesStore()

const today = ref(new Date())
const calendarRef = ref()
const visibleRange = ref({ start: null, end: null })
const events = ref([])

const sidebarOpen = ref(false)
const sidebarDate = ref(new Date())
const selectedDayEvents = ref([])

const addDialog = ref(false)

onMounted(async () => {
  await store.fetchClasses(childId.value, gradeLevel.value)
})

function onRangeUpdate({ start, end }) {
  visibleRange.value = { start, end }
  loadEvents()
}

async function loadEvents() {
  if (!visibleRange.value.start || !visibleRange.value.end) return
  events.value = await store.fetchEventsBetween(
    childId.value,
    gradeLevel.value,
    visibleRange.value.start,
    visibleRange.value.end
  )
}

function onDateClick({ date }) {
  sidebarDate.value = date
  selectedDayEvents.value = events.value
    .filter((e) => sameYmd(e.start, date))
    .sort((a, b) => a.start - b.start)
  sidebarOpen.value = true
}

function sameYmd(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function refreshAfterSave() {
  addDialog.value = false
  store.fetchClasses(childId.value, gradeLevel.value).then(loadEvents)
}
</script>

<template>
  <v-container class="pa-6" fluid>
    <div class="d-flex align-center justify-space-between mb-4">
      <div>
        <h2 class="text-h5 mb-1">Class Schedule</h2>
        <div class="text-body-2 text-medium-emphasis">
          Child ID: <strong>{{ childId }}</strong> • Grade: <strong>{{ gradeLevel }}</strong>
        </div>
      </div>
      <div class="d-flex align-center gap-2">
        <v-btn variant="text" icon @click="today = new Date()">
          <v-icon>mdi-calendar-today</v-icon>
        </v-btn>
        <v-btn color="primary" variant="flat" class="rounded-xl" @click="addDialog = true">
          <v-icon start>mdi-plus</v-icon>
          Add Class
        </v-btn>
      </div>
    </div>

    <v-sheet rounded="xl" elevation="2" class="pa-2">
      <v-calendar
        ref="calendarRef"
        v-model="today"
        :events="events"
        type="month"
        event-color="color"
        @update:range="onRangeUpdate"
        @click:date="onDateClick"
      />
    </v-sheet>

    <DaySidebar v-model="sidebarOpen" :date="sidebarDate" :items="selectedDayEvents" />

    <AddClassDialog
      v-model="addDialog"
      :child-id="childId"
      :grade-level="gradeLevel"
      @saved="refreshAfterSave"
    />
  </v-container>
</template>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
