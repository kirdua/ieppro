<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import useUserStore from '@/stores/user'
import useChildrenStore from '@/stores/children'
import useNotesStore from '@/stores/notes'

import NoteCard from './components/NoteCard.vue'
import AddNoteModal from './components/AddNoteModal.vue'

const userStore = useUserStore()
const childStore = useChildrenStore()
const notesStore = useNotesStore()

const { uid } = userStore.userInfo

const isLoading = ref(false)

/** Read selection from AppBar (children store) */
const childId = computed(() => childStore.selectedChildProfile?.id || null)
const currentGrade = computed(() => childStore.selectedChildProfile?.gradeLevel || '')

/** Ensure children + a selection exist when landing directly here */
onMounted(async () => {
  isLoading.value = true

  if (!childStore.children?.length && uid) {
    await childStore.getChildrenProfiles(uid)
  }

  // If nothing selected yet, default to first child using your existing helper
  if (!childStore.selectedChildProfile && childStore.children.length) {
    childStore.editChildProfile(childStore.children[0])
  }

  await getNotes()
  isLoading.value = false
})

/** Keep notesStore aware of the current selection */
const syncNotesCurrentChild = () => {
  notesStore.currentChildProfile = {
    id: childId.value,
    gradeLevel: currentGrade.value
  }
}

/** Fetch notes for current selection */
const getNotes = async () => {
  if (!childId.value) return
  isLoading.value = true
  try {
    await notesStore.getNotesByGradeLevel({
      id: childId.value,
      gradeLevel: currentGrade.value
    })
  } finally {
    isLoading.value = false
  }
}

/** React to global selection changes */
watch(
  [childId, currentGrade],
  () => {
    syncNotesCurrentChild()
    getNotes()
  },
  { immediate: true }
)

/** Helpers & actions */
const childNameById = (id) => {
  const c = childStore.children.find((x) => x.id === id)
  return c?.name || [c?.firstName, c?.lastName].filter(Boolean).join(' ') || 'Linked'
}

const handleDelete = async (note) => {
  await notesStore.deleteNote(note)
  await getNotes()
}

const handleEdit = (note) => {
  notesStore.openEditNote(note)
}
</script>

<template>
  <div class="pa-4">
    <!-- Selectors removed: rely on AppBar's global Child & Grade -->

    <div v-if="isLoading" class="text-center mt-4">
      <v-progress-circular indeterminate color="primary" />
      <div class="mt-2">Loading Notes...</div>
    </div>

    <div v-else-if="notesStore.notes.length === 0">
      <v-empty-state headline="No notes yet" text="Create your first note.">
        <template #actions>
          <v-btn variant="outlined" color="primary" @click="notesStore.openNewNote()">
            Add Note
          </v-btn>
        </template>
      </v-empty-state>
    </div>

    <div v-else>
      <NoteCard
        :notes="notesStore.notes"
        :child-name-by-id="childNameById"
        @edit-note="handleEdit"
        @delete-note="handleDelete"
      />
    </div>

    <!-- Modal reads from the store (no props needed) -->
    <AddNoteModal @note-added="getNotes" />
  </div>
</template>
