<script setup>
import { ref, watch } from 'vue'
import { progressGradedByOptions, goalSubjects } from '@/constants'

const props = defineProps({
  show: Boolean,
  goal: Object
})

const emit = defineEmits(['update:show', 'save'])

const localGoal = ref({
  goalSubject: '',
  goalFocus: '',
  currentPerformance: '',
  duration: '',
  implementer: '',
  benchmarks: []
})

watch(
  () => props.goal,
  (newGoal) => {
    if (newGoal) {
      localGoal.value = {
        ...newGoal,
        goalSubject: newGoal.goalSubject ?? '',
        implementer: newGoal.implementer ?? '',
        benchmarks: Array.isArray(newGoal.benchmarks) ? [...newGoal.benchmarks] : []
      }
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
  emit('save', {
    ...localGoal.value,
    goalSubject: String(localGoal.value.goalSubject || '').trim()
  })
  closeSidebar()
}
</script>

<template>
  <v-navigation-drawer
    :model-value="props.show"
    @update:model-value="emit('update:show', $event)"
    temporary
    location="right"
    width="600"
    class="pa-0"
  >
    <!-- Header -->
    <v-toolbar density="comfortable" color="primary" class="text-white">
      <v-toolbar-title class="text-subtitle-1 font-weight-medium"> Edit Goal </v-toolbar-title>
      <v-spacer />
      <v-btn icon variant="text" color="white" @click="closeSidebar" aria-label="Close editor">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-divider />

    <!-- Body -->
    <v-card
      flat
      class="pa-4"
      style="height: calc(100% - 48px); display: flex; flex-direction: column"
    >
      <div style="flex: 1; overflow: auto">
        <v-sheet rounded="lg" class="pa-4 mb-4">
          <div class="text-subtitle-2 text-primary mb-3">Details</div>

          <v-row dense>
            <v-col cols="12" md="6">
              <v-select
                v-model="localGoal.goalSubject"
                :items="goalSubjects"
                item-title="label"
                item-value="value"
                label="Subject"
                variant="outlined"
                density="comfortable"
                color="primary"
                prepend-inner-icon="mdi-book-education-outline"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="localGoal.implementer"
                :items="progressGradedByOptions"
                label="Implementer"
                variant="outlined"
                density="comfortable"
                color="primary"
                prepend-inner-icon="mdi-account-check-outline"
                hint="Who measures progress"
                persistent-hint
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="localGoal.duration"
                label="Duration"
                placeholder="e.g., Through Q3 (12 weeks)"
                variant="outlined"
                density="comfortable"
                clearable
                color="primary"
                prepend-inner-icon="mdi-timer-outline"
                hint="Measurement window"
                persistent-hint
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="localGoal.goalFocus"
                label="Goal"
                variant="outlined"
                density="comfortable"
                clearable
                color="primary"
                prepend-inner-icon="mdi-bullseye-arrow"
                hint="Targeted outcome (be specific/measurable)"
                persistent-hint
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="localGoal.currentPerformance"
                label="Current Performance"
                variant="outlined"
                density="comfortable"
                clearable
                color="primary"
                prepend-inner-icon="mdi-clipboard-text-outline"
                hint="Present level of performance"
                persistent-hint
              />
            </v-col>
          </v-row>
        </v-sheet>

        <!-- Benchmarks -->
        <v-sheet rounded="lg" class="pa-4">
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="text-subtitle-2 text-primary">Benchmarks</div>
            <v-btn
              variant="tonal"
              color="secondary"
              size="small"
              prepend-icon="mdi-plus"
              @click="addBenchmark"
            >
              Add benchmark
            </v-btn>
          </div>

          <v-row dense>
            <v-col cols="12" v-for="(b, i) in localGoal.benchmarks" :key="i">
              <v-text-field
                v-model="localGoal.benchmarks[i]"
                label="Benchmark"
                variant="outlined"
                density="comfortable"
                color="primary"
                placeholder="Measurable checkpoint (e.g., 80% retell accuracy)"
                prepend-inner-icon="mdi-flag-outline"
              >
                <template #append-inner>
                  <v-tooltip text="Remove benchmark" location="top">
                    <template #activator="{ props }">
                      <v-icon
                        v-bind="props"
                        class="cursor-pointer"
                        color="error"
                        @click="removeBenchmark(i)"
                      >
                        mdi-close-circle
                      </v-icon>
                    </template>
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-sheet>
      </div>

      <v-divider class="my-3" />

      <!-- Sticky footer actions -->
      <div class="d-flex gap-2">
        <v-btn class="flex-1-1" variant="text" color="default" @click="closeSidebar">Cancel</v-btn>
        <v-btn
          class="flex-1-1"
          color="primary"
          variant="elevated"
          @click="saveGoal"
          prepend-icon="mdi-content-save"
        >
          Save Changes
        </v-btn>
      </div>
    </v-card>
  </v-navigation-drawer>
</template>

<style scoped>
.flex-1-1 {
  flex: 1 1 0;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
