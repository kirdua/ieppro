<script setup>
import { ref, onMounted, watch } from 'vue'
import { gradeLevels } from '@/utils/child-options'
import useUserStore from '@/stores/user'
import useChildrenStore from '@/stores/children'
import useNotesStore from '@/stores/notes'

import NoteCard from './components/NoteCard.vue'
import AddNoteModal from './components/AddNoteModal.vue'

const userStore = useUserStore()
const childrenStore = useChildrenStore()
const notesStore = useNotesStore()

const { uid } = userStore.userInfo

const isLoading = ref(false)
const selectedChildId = ref(null)
const currentGrade = ref('') // ✅ add grade level state
const childOptions = ref([])

// Helper used by NoteCard
const childNameById = (id) => {
  const c = childrenStore.children.find((x) => x.id === id)
  return c?.name || [c?.firstName, c?.lastName].filter(Boolean).join(' ') || 'Linked'
}

// Init children + default selection (first child)
onMounted(async () => {
  isLoading.value = true
  await childrenStore.getChildrenProfiles(uid)

  childOptions.value = (childrenStore.children || []).map((child) => ({
    name: child.name || [child.firstName, child.lastName].filter(Boolean).join(' '),
    id: child.id,
    gradeLevel: child.gradeLevel || ''
  }))

  if (childOptions.value.length) {
    selectedChildId.value = childOptions.value[0].id
    currentGrade.value = childOptions.value[0].gradeLevel || ''
  }

  isLoading.value = false
})

// When the selected child changes, sync grade level to that child’s grade
watch(selectedChildId, (id) => {
  const c = childOptions.value.find((x) => x.id === id)
  currentGrade.value = c?.gradeLevel || ''
})

// Stubs (fill later)
const getNotes = async () => {}
const handleDelete = async () => {}
const handleTogglePin = async () => {}
</script>

<template>
  <div class="pa-4">
    <div class="d-flex w-100 flex-inline">
      <v-select
        label="Child"
        v-model="selectedChildId"
        :items="childOptions"
        item-value="id"
        item-title="name"
        variant="outlined"
        class="w-35 mr-5"
        :disabled="isLoading"
      ></v-select>
      <v-select
        label="Grade Level"
        v-model="currentGrade"
        :items="gradeLevels"
        variant="outlined"
        class="w-35"
        :disabled="isLoading"
      ></v-select>
    </div>

    <div v-if="isLoading" class="text-center mt-4">
      <v-progress-circular indeterminate color="primary" />
      <div class="mt-2">Loading Notes...</div>
    </div>

    <div v-else-if="notesStore.notes.length === 0">
      <v-empty-state headline="No notes yet" text="Create your first note.">
        <template #actions>
          <v-btn variant="outlined" color="primary" @click="notesStore.noteModalIsVisible = true">
            Add Note
          </v-btn>
        </template>
      </v-empty-state>
    </div>

    <div v-else>
      <NoteCard
        :notes="notesStore.notes"
        :child-name-by-id="childNameById"
        @delete-note="handleDelete"
        @toggle-pin="handleTogglePin"
      />
    </div>

    <!-- Matches Goals pattern: modal binds internally to store visibility and emits a single event -->
    <AddNoteModal :selectedChildId="selectedChildId" @note-added="getNotes" />
  </div>
</template>
