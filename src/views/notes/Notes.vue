<script setup>
import { ref, onMounted, watch } from 'vue'
import { gradeLevels } from '@/utils/child-options'
import useUserStore from '@/stores/user'
import useChildrenStore from '@/stores/children'
import useNotesStore from '@/stores/notes'

import NoteCard from './components/NoteCard.vue'
import AddNoteModal from './components/AddNoteModal.vue'

const userStore = useUserStore()
const childStore = useChildrenStore()
const notesStore = useNotesStore()

const { uid } = userStore.userInfo

const currentGrade = ref('')
const selectedChildId = ref(null)
const childOptions = ref([])
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  await childStore.getChildrenProfiles(uid)

  if (childStore.children.length > 0) {
    childOptions.value = childStore.children.map((child) => ({
      name: child.name || [child.firstName, child.lastName].filter(Boolean).join(' '),
      id: child.id,
      gradeLevel: child.gradeLevel || ''
    }))
    selectedChildId.value = childOptions.value[0].id
    currentGrade.value = childOptions.value[0].gradeLevel || ''
  }

  updateCurrentChildProfile()
  await getNotes()
  isLoading.value = false
})

const updateCurrentChildProfile = () => {
  notesStore.currentChildProfile = {
    id: selectedChildId.value,
    gradeLevel: currentGrade.value
  }
}

watch([selectedChildId, currentGrade], () => {
  updateCurrentChildProfile()
})

watch(
  () => [selectedChildId.value, currentGrade.value],
  async () => {
    await getNotes()
  }
)

const getNotes = async () => {
  isLoading.value = true
  await notesStore.getNotesByGradeLevel({
    id: selectedChildId.value,
    gradeLevel: currentGrade.value
  })
  isLoading.value = false
}

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
      />
      <v-select
        label="Grade Level"
        v-model="currentGrade"
        :items="gradeLevels"
        variant="outlined"
        class="w-35"
        :disabled="isLoading"
      />
    </div>

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
