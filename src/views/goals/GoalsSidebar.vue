<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  show: Boolean,
  goal: Object
})

const emit = defineEmits(['update:show'])

const newBenchmarks = ref([])

const addBenchmark = () => {
  newBenchmarks.value.push('')
}

const removeBenchmark = (index) => {
  newBenchmarks.value.splice(index, 1)
}

const closeSidebar = () => {
  emit('update:show', false)
}
</script>

<template>
  <v-navigation-drawer
    :model-value="props.show"
    @update:model-value="emit('update:show', $event)"
    app
    temporary
    location="right"
    width="400"
    class="pt-4"
  >
    <template v-if="props.goal">
      <v-list-item>
        <template #append>
          <v-btn icon="mdi-close" variant="plain" @click="closeSidebar" />
        </template>
      </v-list-item>

      <v-list>
        <v-list-item>
          <v-list-item-title>
            <strong>Goal Focus:</strong> {{ props.goal.goalFocus }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title> <strong>Type:</strong> {{ props.goal.goalType }} </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            <strong>Performance:</strong> {{ props.goal.currentPerformance }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            <strong>Duration:</strong> {{ props.goal.duration }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            <strong>Implementer:</strong> {{ props.goal.implementer }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            <strong>Benchmarks:</strong>
          </v-list-item-title>
          <ul>
            <li v-for="(b, i) in props.goal.benchmarks" :key="i">{{ i + 1 }}. {{ b }}</li>
          </ul>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>
