<script setup>
import { ref, watch } from 'vue'
import { goalTypeItems, progressGradedByOptions } from '@/constants'
const props = defineProps({
  show: Boolean,
  goal: Object
})

const emit = defineEmits(['update:show', 'save'])

const localGoal = ref({
  goalFocus: '',
  goalType: '',
  currentPerformance: '',
  duration: '',
  implementer: '',
  benchmarks: []
})

watch(
  () => props.goal,
  (newGoal) => {
    if (newGoal) {
      localGoal.value = { ...newGoal, benchmarks: [...newGoal.benchmarks] }
    }
  },
  { immediate: true }
)

const closeSidebar = () => {
  emit('update:show', false)
}

const addBenchmark = () => {
  localGoal.value.benchmarks.push('')
}

const removeBenchmark = (index) => {
  localGoal.value.benchmarks.splice(index, 1)
}

const saveGoal = () => {
  emit('save', localGoal.value)
  closeSidebar()
}
</script>

<template>
  <v-navigation-drawer
    :model-value="props.show"
    @update:model-value="emit('update:show', $event)"
    app
    temporary
    location="right"
    width="600"
    class="pt-4 px-4"
  >
    <template v-if="props.goal">
      <v-list-item>
        <h3 class="text-h6"><strong>Goal</strong></h3>
        <template #append>
          <v-btn icon="mdi-close" variant="plain" @click="closeSidebar" />
        </template>
      </v-list-item>

      <v-list>
        <v-text-field v-model="localGoal.goalFocus" label="Goal Focus" dense />
        <v-select
          v-model="localGoal.goalType"
          :items="goalTypeItems"
          label="Type"
          dense
          variant="outlined"
        />
        <v-text-field v-model="localGoal.currentPerformance" label="Performance" dense />
        <v-text-field v-model="localGoal.duration" label="Duration" dense />
        <v-select
          v-model="localGoal.implementer"
          :items="progressGradedByOptions"
          label="Implementer"
          dense
          variant="outlined"
        />
        <div class="px-4 mt-4">
          <div class="d-flex justify-space-between align-center mb-2">
            <strong>Benchmarks:</strong>
            <v-btn size="small" @click="addBenchmark" variant="tonal">+ Add Benchmark</v-btn>
          </div>
          <div v-for="(b, i) in localGoal.benchmarks" :key="i" class="d-flex align-center mb-2">
            <v-text-field
              v-model="localGoal.benchmarks[i]"
              label="Benchmark"
              dense
              class="flex-grow-1"
            />
            <v-btn
              variant="outlined"
              icon
              color="error"
              @click="removeBenchmark(i)"
              density="compact"
            >
              <v-icon size="18">mdi-delete</v-icon>
            </v-btn>
          </div>
        </div>
      </v-list>

      <div class="pa-4">
        <v-btn color="primary" block @click="saveGoal">Save Changes</v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>
