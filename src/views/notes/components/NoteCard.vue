<script setup>
import { computed } from 'vue'

const props = defineProps({
  notes: { type: Array, required: true },
  childNameById: { type: Function, required: true }
})
const emit = defineEmits(['edit-note', 'delete-note'])

const sortedNotes = computed(() => {
  // pinned first; newest first after that
  return [...props.notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    const at = a.updatedAt?.toMillis?.() ?? new Date(a.updatedAt || a.createdAt || 0).getTime()
    const bt = b.updatedAt?.toMillis?.() ?? new Date(b.updatedAt || b.createdAt || 0).getTime()
    return bt - at
  })
})
</script>

<template>
  <v-row dense>
    <v-col v-for="note in sortedNotes" :key="note.id" cols="12" md="6" lg="4">
      <v-card class="rounded-lg" variant="elevated">
        <v-card-title
          class="d-flex justify-space-between align-center"
          style="background-color: rgb(var(--v-theme-primary-50))"
        >
          <span class="text-truncate text-primary">{{ note.title || 'Untitled' }}</span>
          <div class="d-flex align-center ga-2">
            <span class="text-caption text-primary" v-if="note.meetingDate">{{
              note.meetingDate
            }}</span>
            <v-chip size="x-small" variant="tonal" color="primary">
              {{ childNameById(note.childId) }}
            </v-chip>
            <v-chip size="x-small" color="secondary" variant="tonal" v-if="note.currentGrade">
              {{ note.currentGrade }}
            </v-chip>
          </div>
        </v-card-title>
        <hr />
        <v-card-text style="min-height: 76px">
          <div
            class="text-body-2"
            style="
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              overflow: hidden;
            "
          >
            {{ note.content || '—' }}
          </div>
        </v-card-text>

        <v-card-actions class="justify-end">
          <div class="d-flex ga-1">
            <v-btn size="small" variant="text" @click="emit('edit-note', note)">View/Edit</v-btn>
            <v-btn size="small" variant="text" color="error" @click="emit('delete-note', note)">
              Delete
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
