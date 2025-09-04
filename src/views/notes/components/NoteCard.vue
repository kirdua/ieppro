<script setup>
import { computed } from 'vue'

const props = defineProps({
  notes: { type: Array, required: true },
  childNameById: { type: Function, required: true }
})
const emit = defineEmits(['edit-note', 'delete-note'])

const sortedNotes = computed(() => {
  return [...props.notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    const at = a.updatedAt?.toMillis?.() ?? new Date(a.updatedAt || a.createdAt || 0).getTime()
    const bt = b.updatedAt?.toMillis?.() ?? new Date(b.updatedAt || b.createdAt || 0).getTime()
    return bt - at
  })
})

const preview = (text) => (text && text.trim()) || '—'
</script>

<template>
  <v-row dense>
    <v-col v-for="note in sortedNotes" :key="note.id" cols="12" md="6" lg="4">
      <v-card class="rounded-xl hover-elevate" elevation="6">
        <!-- Header -->
        <v-sheet
          color="primary"
          variant="tonal"
          class="px-4 py-3 rounded-t-xl d-flex align-center justify-space-between"
        >
          <div class="d-flex align-center gap-2 min-w-0">
            <v-icon size="18" class="mr-1 text-white">mdi-note-text</v-icon>
            <span class="text-subtitle-1 font-medium text-truncate text-white">
              {{ note.title || 'Untitled' }}
            </span>
          </div>
          <div class="px-4 py-2 d-flex align-center flex-wrap gap-3">
            <!-- Meeting Date -->
            <div class="d-flex align-center text-medium-emphasis">
              <v-icon size="16" class="mr-1 text-white">mdi-calendar</v-icon>
              <span class="text-caption text-white">{{ note.meetingDate || 'No date' }}</span>
            </div>

            <!-- Child -->
            <div class="d-flex align-center text-medium-emphasis">
              <v-icon size="16" class="mr-1 text-white">mdi-account-child</v-icon>
              <span class="text-caption text-white">{{ childNameById(note.childId) }}</span>
            </div>

            <!-- Grade -->
            <div v-if="note.currentGrade" class="d-flex align-center text-medium-emphasis">
              <v-icon size="16" class="mr-1 text-white">mdi-school</v-icon>
              <span class="text-caption text-white">{{ note.currentGrade }}</span>
            </div>
          </div>

          <v-chip
            v-if="note.pinned"
            size="x-small"
            class="ml-2"
            color="primary"
            variant="elevated"
            prepend-icon="mdi-pin"
          >
            Pinned
          </v-chip>
        </v-sheet>

        <v-divider />

        <!-- Content preview -->
        <v-card-text class="pt-3 pb-2">
          <div class="text-body-2 clamp-3">
            {{ preview(note.content) }}
          </div>
        </v-card-text>

        <v-divider />

        <!-- Actions -->
        <v-card-actions class="px-3 py-2 d-flex justify-end">
          <v-btn
            size="small"
            variant="text"
            prepend-icon="mdi-pencil"
            @click="emit('edit-note', note)"
          >
            View/Edit
          </v-btn>
          <v-btn
            size="small"
            variant="text"
            color="error"
            prepend-icon="mdi-delete-outline"
            @click="emit('delete-note', note)"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.hover-elevate {
  transition: box-shadow 160ms ease;
}
.hover-elevate:hover {
  box-shadow: var(--v-shadow-4);
}

.clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.gap-2 {
  gap: 0.5rem;
}
.gap-3 {
  gap: 0.75rem;
}
.font-medium {
  font-weight: 600;
}
.min-w-0 {
  min-width: 0;
}
</style>
