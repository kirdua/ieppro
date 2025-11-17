<!-- src/components/schedule/AddClassDialog.vue -->
<script setup>
import { ref, watch, computed } from 'vue'
import { useClassesStore } from '@/stores/classes'
import { COLOR_OPTIONS, DAY_OPTIONS } from '@/constants/schedule'
import { mmddyyyyToDate } from '@/utils/date'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  childId: { type: String, required: true },
  gradeLevel: { type: [String, Number], required: true }
})
const emit = defineEmits(['update:modelValue', 'saved'])

const store = useClassesStore()
const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const formRef = ref()
const form = ref({
  title: '',
  teacher: '',
  location: '',
  color: 'blue',
  startDate: '', // MM-DD-YYYY
  endDate: '', // MM-DD-YYYY
  daysOfWeek: [],
  startTime: '', // HH:mm
  endTime: '', // HH:mm
  exceptions: '' // comma-separated MM-DD-YYYY
})

const rules = {
  required: (v) => !!v || v === 0 || 'Required',
  min1: (v) => (Array.isArray(v) && v.length > 0) || 'Pick at least one',
  timeOrder: () => {
    const f = form.value
    if (!f.startTime || !f.endTime) return true
    return f.startTime < f.endTime || 'End time must be after start time'
  },
  dateFmt: (v) => /^\d{2}-\d{2}-\d{4}$/.test(String(v)) || 'Use MM-DD-YYYY',
  dateOrder: () => {
    const f = form.value
    if (!f.startDate || !f.endDate) return true
    const start = mmddyyyyToDate(f.startDate)
    const end = mmddyyyyToDate(f.endDate)
    return start <= end || 'End date must be after start date'
  }
}

function reset() {
  form.value = {
    title: '',
    teacher: '',
    location: '',
    color: 'blue',
    startDate: '',
    endDate: '',
    daysOfWeek: [],
    startTime: '',
    endTime: '',
    exceptions: ''
  }
  formRef.value?.resetValidation?.()
}

watch(open, (v) => v && reset())

async function save() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  const exceptions = String(form.value.exceptions || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  await store.addClass({
    title: form.value.title,
    teacher: form.value.teacher,
    location: form.value.location,
    color: form.value.color,
    startDate: form.value.startDate,
    endDate: form.value.endDate,
    daysOfWeek: form.value.daysOfWeek,
    startTime: form.value.startTime,
    endTime: form.value.endTime,
    exceptions,
    childId: props.childId,
    gradeLevel: String(props.gradeLevel)
  })

  emit('saved')
  open.value = false
}
</script>

<template>
  <v-dialog v-model="open" max-width="720">
    <v-card rounded="xl">
      <v-toolbar color="primary" density="comfortable" class="rounded-t-xl">
        <v-toolbar-title class="text-white">Add Class</v-toolbar-title>
        <v-spacer />
        <v-btn icon variant="text" @click="open = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pt-6">
        <v-form ref="formRef" validate-on="input">
          <v-row>
            <v-col cols="12" md="7">
              <v-text-field
                v-model="form.title"
                label="Class title"
                :rules="[rules.required]"
                hide-details="auto"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="5">
              <v-select
                v-model="form.color"
                :items="COLOR_OPTIONS"
                label="Color"
                hide-details="auto"
                density="comfortable"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.teacher"
                label="Teacher"
                hide-details="auto"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.location"
                label="Location"
                hide-details="auto"
                density="comfortable"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.startDate"
                label="Start date"
                placeholder="MM-DD-YYYY"
                :rules="[rules.required, rules.dateFmt, rules.dateOrder]"
                hide-details="auto"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.endDate"
                label="End date"
                placeholder="MM-DD-YYYY"
                :rules="[rules.required, rules.dateFmt, rules.dateOrder]"
                hide-details="auto"
                density="comfortable"
              />
            </v-col>

            <v-col cols="12">
              <div class="text-caption text-medium-emphasis mb-2">Days of week</div>
              <v-btn-toggle
                v-model="form.daysOfWeek"
                multiple
                class="w-100"
                rounded="lg"
                variant="tonal"
                color="primary"
                density="comfortable"
                :rules="[rules.min1]"
              >
                <v-btn v-for="d in DAY_OPTIONS" :key="d.value" :value="d.value" class="flex-1">{{
                  d.label
                }}</v-btn>
              </v-btn-toggle>
              <v-messages
                :value="form.daysOfWeek.length ? [] : ['Pick at least one']"
                class="mt-1"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.startTime"
                label="Start time"
                type="time"
                :rules="[rules.required, rules.timeOrder]"
                hide-details="auto"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.endTime"
                label="End time"
                type="time"
                :rules="[rules.required, rules.timeOrder]"
                hide-details="auto"
                density="comfortable"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="form.exceptions"
                label="Skip dates (MM-DD-YYYY, comma-separated)"
                hint="e.g. 11-28-2025, 12-02-2025"
                persistent-hint
                hide-details="auto"
                density="comfortable"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="px-4 pb-4">
        <v-spacer />
        <v-btn variant="text" @click="open = false">Cancel</v-btn>
        <v-btn color="primary" variant="flat" class="rounded-lg" @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.flex-1 {
  flex: 1 1 0;
}
</style>
