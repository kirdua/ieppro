<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import { progressGradedByOptions } from '@/constants'

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

const rules = {
  required: (v) => (!!v && String(v).trim().length > 0) || 'Required'
}

const formRef = ref()

// Hydrate from incoming goal
const hydrate = (g) => {
  if (!g) return
  localGoal.value = {
    goalSubject: g.goalSubject ?? '',
    goalFocus: g.goalFocus ?? '',
    currentPerformance: g.currentPerformance ?? '',
    duration: g.duration ?? '',
    implementer: g.implementer ?? '',
    benchmarks: Array.isArray(g.benchmarks) ? [...g.benchmarks] : []
  }
  nextTick(() => formRef.value?.resetValidation?.())
}

watch(
  () => props.goal,
  (g) => hydrate(g),
  { immediate: true }
)

// Close (discard changes)
const closeSidebar = async () => {
  emit('update:show', false)
  await nextTick()
  hydrate(props.goal) // restore fields when closed w/o saving
}

// Keep v-model:show in sync
const onModelUpdate = async (v) => {
  emit('update:show', v)
  if (!v) {
    await nextTick()
    hydrate(props.goal)
  }
}

// Benchmarks
const addBenchmark = () => localGoal.value.benchmarks.push('')
const removeBenchmark = (index) => localGoal.value.benchmarks.splice(index, 1)

// Save
const canSave = computed(() => {
  const g = localGoal.value
  const hasBenchmarks = g.benchmarks.map((b) => String(b || '').trim()).filter(Boolean).length > 0
  return !!(
    g.goalSubject &&
    g.implementer &&
    g.duration &&
    g.goalFocus &&
    g.currentPerformance &&
    hasBenchmarks
  )
})

const saveGoal = async () => {
  const valid = await formRef.value?.validate()
  if (valid === false) return
  emit('save', {
    ...localGoal.value,
    benchmarks: localGoal.value.benchmarks.map((b) => String(b).trim()).filter(Boolean)
  })
  closeSidebar()
}
</script>

<template>
  <v-navigation-drawer
    :model-value="props.show"
    @update:model-value="onModelUpdate"
    temporary
    location="right"
    width="560"
    class="pa-0"
  >
    <v-toolbar density="comfortable" color="primary" class="text-white">
      <v-toolbar-title class="text-subtitle-1 font-weight-medium">Edit Goal</v-toolbar-title>
      <v-spacer />
      <v-btn icon variant="text" color="white" @click="closeSidebar" aria-label="Close">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-divider />

    <v-card
      flat
      class="pa-4"
      style="height: calc(100% - 48px); display: flex; flex-direction: column"
    >
      <v-form ref="formRef" validate-on="input" style="flex: 1; overflow: auto">
        <v-sheet rounded="lg" class="pa-4 mb-4">
          <div class="text-subtitle-2 text-primary mb-3">Details</div>
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="localGoal.goalSubject"
                label="Subject"
                placeholder="e.g., Reading, Math"
                variant="outlined"
                density="comfortable"
                clearable
                color="primary"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-book-education-outline"
                hint="Subject area for this goal"
                persistent-hint
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="localGoal.implementer"
                :items="progressGradedByOptions"
                label="Implementer"
                variant="outlined"
                density="comfortable"
                color="primary"
                :rules="[rules.required]"
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
                :rules="[rules.required]"
                prepend-inner-icon="mdi-timer-outline"
                hint="Measurement window"
                persistent-hint
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="localGoal.goalFocus"
                label="Goal focus"
                variant="outlined"
                density="comfortable"
                rows="3"
                auto-grow
                clearable
                color="primary"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-bullseye-arrow"
                hint="Targeted outcome (be specific/measurable)"
                persistent-hint
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="localGoal.currentPerformance"
                label="Current performance"
                variant="outlined"
                density="comfortable"
                rows="3"
                auto-grow
                clearable
                color="primary"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-clipboard-text-outline"
                hint="Present level of performance"
                persistent-hint
              />
            </v-col>
          </v-row>
        </v-sheet>

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
              :rules="[rules.required]"
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
      </v-form>

      <v-divider class="my-2" />

      <!-- Sticky footer actions -->
      <div class="d-flex gap-2">
        <v-btn class="flex-1-1" variant="text" color="default" @click="closeSidebar">Cancel</v-btn>
        <v-btn
          class="flex-1-1"
          :disabled="!canSave"
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
