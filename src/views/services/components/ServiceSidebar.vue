<script setup>
import { ref, watch } from 'vue'
import { semesterOptions, locationOptions, progressGradedByOptions } from '@/constants'

const props = defineProps({
  show: { type: Boolean, default: false },
  service: { type: Object, default: null }
})
const emit = defineEmits(['update:show', 'save'])

// local editable copy (never mutate the prop directly)
const blank = () => ({
  id: '',
  childId: '',
  gradeLevel: '',
  semester: null,
  year: '',
  course: '',
  location: '',
  genEdModified: false,
  genEducationTime: '',
  specialEducationTime: '',
  gradedBy: ''
})
const localService = ref(blank())

// sync local copy when parent passes a new service
watch(
  () => props.service,
  (s) => {
    localService.value = s ? { ...blank(), ...s } : blank()
  },
  { immediate: true }
)

const close = () => emit('update:show', false)
const save = () => {
  emit('save', { ...localService.value })
  close()
}
</script>

<template>
  <v-navigation-drawer
    :model-value="props.show"
    @update:model-value="emit('update:show', $event)"
    app
    temporary
    location="right"
    width="560"
    class="pt-4 px-4"
  >
    <v-list-item>
      <h3 class="text-h6 text-primary"><strong>Service</strong></h3>
      <template #append>
        <v-btn icon="mdi-close" variant="plain" @click="close" />
      </template>
    </v-list-item>

    <v-alert v-if="!props.service" type="info" variant="tonal" border="start" class="mb-3">
      Select a service to view and edit.
    </v-alert>

    <template v-else>
      <v-list class="overflow-y-auto" style="max-height: calc(100vh - 200px)">
        <v-select
          v-model="localService.semester"
          :items="semesterOptions"
          label="Semester"
          variant="outlined"
        />
        <v-text-field
          v-model="localService.year"
          label="Year"
          placeholder="2023-2024"
          variant="outlined"
        />
        <v-text-field
          v-model="localService.course"
          label="Course"
          placeholder="Math, Reading, etc."
          variant="outlined"
        />
        <v-select
          v-model="localService.location"
          :items="locationOptions"
          label="Location"
          variant="outlined"
        />
        <v-checkbox
          v-model="localService.genEdModified"
          label="General Education Modified"
          color="primary"
        />
        <v-text-field
          v-model="localService.genEducationTime"
          type="number"
          min="0"
          label="General Education Time"
          placeholder="20"
          variant="outlined"
        />
        <v-text-field
          v-model="localService.specialEducationTime"
          type="number"
          min="0"
          label="Special Education Time"
          placeholder="20"
          variant="outlined"
        />
        <v-select
          v-model="localService.gradedBy"
          :items="progressGradedByOptions"
          label="Progress Graded By"
          variant="outlined"
        />
        <v-text-field
          v-model="localService.startDate"
          label="Start Date"
          placeholder="01/01/2025"
          variant="outlined"
        />
        <v-text-field
          v-model="localService.endDate"
          label="End Date"
          placeholder="01/01/2025"
          variant="outlined"
        />
      </v-list>

      <div class="pt-3 pb-4">
        <v-btn color="primary" block @click="save">Save Changes</v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>
