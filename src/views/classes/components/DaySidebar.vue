<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  date: { type: Date, required: true },
  items: { type: Array, default: () => [] }
})
const emit = defineEmits(['update:modelValue'])

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

function formatTime(d) {
  try {
    return d instanceof Date
      ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : String(d)
  } catch (e) {
    return String(d)
  }
}
</script>

<template>
  <v-dialog v-model="open" max-width="420">
    <v-card rounded="lg">
      <v-toolbar density="comfortable">
        <v-toolbar-title class="text-h6">{{ props.date.toDateString() }}</v-toolbar-title>
        <v-spacer />
        <v-btn icon variant="text" @click="open = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <div v-if="!props.items || props.items.length === 0" class="text-center py-6">
          No events for this day
        </div>

        <v-list v-else>
          <v-list-item v-for="it in props.items" :key="it.data?.id || it.title">
            <v-list-item-content>
              <div class="text-subtitle-1">{{ it.title }}</div>
              <div class="text-caption text-medium-emphasis">
                {{ formatTime(it.start) }} — {{ formatTime(it.end) }}
              </div>
              <div class="text-body-2">{{ it.data?.location }}</div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.py-6 {
  padding-top: 24px;
  padding-bottom: 24px;
}
</style>
