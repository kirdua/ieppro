<!-- src/views/notes/components/NoteCard.vue -->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  notes: { type: Array, required: true },
  childNameById: { type: Function, required: true }
})
const emit = defineEmits(['toggle-pin', 'delete-note'])

const sortedNotes = computed(() => {
  // pinned first; stable otherwise
  return [...props.notes].sort((a, b) => Number(b.pinned) - Number(a.pinned))
})
</script>

<template>
  <div>Note Card</div>
</template>
