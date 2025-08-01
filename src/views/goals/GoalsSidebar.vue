<script setup>
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import useGoalsStore from '@/stores/goals'

const goalsStore = useGoalsStore()

const newBenchmarks = ref([])

const addBenchmark = () => {
  newBenchmarks.value.push('')
}

const removeBenchmark = (index) => {
  newBenchmarks.value.splice(index, 1)
}

const updateGoals = () => {
  // goalsStore.selectedGoalRow.benchmarks.push(...newBenchmarks.value)

  try {
    goalsStore.updateGoalsByGradeLevel(...newBenchmarks.value)
    newBenchmarks.value = []
    toast.success('Updated benckmarks')
  } catch (error) {
    toast.success('Failed to add benchmarks')
  }
}
</script>

<template>
  <v-navigation-drawer
    v-model="goalsStore.showGoalsSidebar"
    app
    temporary
    location="right"
    width="400"
    :class="$style.detailsDrawer"
  >
    <v-list-item nav class="custom-background">
      <template v-slot:append>
        <v-btn
          icon="mdi-close-thick"
          variant="plain"
          color="blue-1"
          @click.stop="goalsStore.toggleGoalsDrawer(false)"
        ></v-btn>
      </template>
    </v-list-item>

    <v-list class="scrollable-list">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            <strong>Goal Focus:</strong> {{ goalsStore.selectedGoalRow.goalFocus }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            <strong>Goal Type:</strong> {{ goalsStore.selectedGoalRow.goalType }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            <strong>Current Performance:</strong>
            {{ goalsStore.selectedGoalRow.currentPerformance }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            <strong>Duration:</strong> {{ goalsStore.selectedGoalRow.duration }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            <strong>Implementer:</strong> {{ goalsStore.selectedGoalRow.implementer }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            <v-row class="d-flex align-center">
              <v-col>
                <h4>Benchmarks:</h4>
              </v-col>
              <v-col cols="auto">
                <v-tooltip text="Add benchmark">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      color="blue-1"
                      icon="mdi mdi-plus-thick"
                      variant="plain"
                      @click="addBenchmark"
                    >
                    </v-btn>
                  </template>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-list-item-title>

          <v-list>
            <!-- Existing Benchmarks -->
            <v-list-item
              v-for="(benchmark, index) in goalsStore.selectedGoalRow.benchmarks"
              :key="index"
            >
              <v-list-item-content>
                <v-list-item-title>{{ index + 1 }}. {{ benchmark }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <!-- New Benchmarks -->
            <v-list-item v-for="(benchmark, index) in newBenchmarks" :key="'new-' + index">
              <v-list-item-content>
                <v-text-field
                  v-model="newBenchmarks[index]"
                  variant="outlined"
                  :append-inner-icon="'mdi-delete'"
                  append-icon-cb
                  @click:append-inner="removeBenchmark(index)"
                ></v-text-field>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-list-item v-if="newBenchmarks.length > 0">
      <v-btn color="blue-1" block @click="updateGoals"> Submit </v-btn>
    </v-list-item>
  </v-navigation-drawer>
</template>

<style module>
.detailsDrawer {
  top: 60px !important;
  height: calc(100vh - 60px);
}

.scrollable-list {
  overflow-y: auto;
  max-height: calc(100vh - 120px); /* Adjust height as needed */
}
</style>
