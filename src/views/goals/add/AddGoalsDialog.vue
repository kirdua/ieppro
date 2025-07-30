<script setup>
import { ref, toRaw } from 'vue'
import useGoalsStore from '@/stores/goals'
import { progressGradedByOptions } from '@/constants'
import { v7 as uuidv7 } from 'uuid'

const goalsStore = useGoalsStore()
const goalTypeItems = ['Academic', 'Functional', 'Related Services']
const myuuid = uuidv7()

const emit = defineEmits(['save-goal'])

const goalFocus = ref('')
const goalType = ref(goalTypeItems[0])
const currentPerformance = ref('')
const duration = ref('')
const benchmarks = ref([''])
const currentImplementer = ref(progressGradedByOptions[1])
const _id = ref()

const addBenchmark = () => {
  benchmarks.value.push('')
}

const removeBenchmark = (index) => {
  benchmarks.value.splice(index, 1)
}

const closeGoalsModal = () => {
  goalsStore.modalIsVisible = false
  goalFocus.value = ''
  goalType.value = goalTypeItems[0]
  currentPerformance.value = ''
  duration.value = ''
  benchmarks.value = ['']
  currentImplementer.value = progressGradedByOptions[1]
  _id.value = ''
}

const saveGoal = () => {
  emit('save-goal', {
    goalFocus: goalFocus.value,
    goalType: goalType.value,
    currentPerformance: currentPerformance.value,
    duration: duration.value,
    benchmarks: toRaw(benchmarks.value),
    implementer: currentImplementer.value,
    id: _id.value || myuuid,
    createdDate: new Date().toISOString()
  })
  closeGoalsModal()
}
</script>

<template>
  <v-dialog v-model="goalsStore.modalIsVisible" max-width="600">
    <v-card prepend-icon="mdi-check-circle" class="text-blue" title="Goal">
      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="6" sm="6">
            <v-text-field
              label="Goal"
              required
              v-model="goalFocus"
              placeholder="Math, Reading, etc..."
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6" sm="6">
            <v-autocomplete
              :items="goalTypeItems"
              label="Goal Type"
              auto-select-first
              v-model="goalType"
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" md="12" sm="12">
            <v-text-field
              v-model="currentPerformance"
              label="Current performance"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="12" sm="12">
            <v-text-field v-model="duration" label="Duration"></v-text-field>
          </v-col>

          <v-col cols="12" md="12" sm="12" v-for="(benchmark, index) in benchmarks" :key="index">
            <v-text-field
              v-model="benchmarks[index]"
              label="Benchmark"
              append-inner-icon="mdi-close-circle"
              @click:append-inner="removeBenchmark(index)"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="12" sm="12">
            <div class="d-flex justify-end">
              <v-btn @click="addBenchmark">Add Benchmark</v-btn>
            </div>
          </v-col>

          <v-col cols="12" sm="12">
            <v-autocomplete
              v-model="currentImplementer"
              :items="progressGradedByOptions"
              label="Implementer"
            ></v-autocomplete>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text="Close" variant="plain" @click="closeGoalsModal"></v-btn>

        <v-btn color="primary" text="Save" variant="tonal" @click="saveGoal"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
