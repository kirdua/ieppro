<!-- src/views/notes/components/AddNoteModal.vue -->
<script setup>
import { ref, watch, computed } from 'vue'
import { toast } from 'vue3-toastify'
import useNotesStore from '@/stores/notes'
import useChildrenStore from '@/stores/children'

const MAX_PINS = 5

const props = defineProps({
  selectedChildId: { type: [String, Number, null], default: null }
})
const emit = defineEmits(['note-added'])

const notesStore = useNotesStore()
const childrenStore = useChildrenStore()

const valid = ref(false)
const localForm = ref({
  title: '',
  content: '',
  childId: null,
  meetingDate: null,
  pinned: false
})

const close = () => {
  notesStore.noteModalIsVisible = false
}

const saveNote = async () => {
  try {
    await notesStore.addNote(localForm.value)
    toast.success('Note added successfully!')
    emit('note-added')
    close()
  } catch (error) {
    console.error('Error adding note:', error)
    toast.error('Failed to add note. Please try again.')
    return
  }
}
</script>

<template>
  <!-- follows Goals pattern: modal binds internally to the store flag -->
  <v-dialog v-model="notesStore.noteModalIsVisible" max-width="720">
    <v-card class="rounded-xl">
      <v-card-title class="d-flex justify-space-between align-center text-primary">
        <span>New Note</span>
        <v-btn icon="mdi-close" variant="text" @click="close" />
      </v-card-title>

      <v-card-text class="pt-0">
        <v-form v-model="valid" lazy-validation>
          <v-text-field
            v-model="localForm.title"
            label="Title"
            :rules="[(v) => !!v || 'Title is required']"
            required
          />
          <v-select
            v-model="localForm.childId"
            :items="childrenStore.children"
            item-value="id"
            item-title="name"
            label="Child"
            :rules="[(v) => !!v || 'Child is required']"
            :disabled="childrenStore.children.length === 0"
            required
          />
          <v-text-field
            v-model="localForm.meetingDate"
            label="Meeting Date"
            type="text"
            placeholder="MM-DD-YYYY"
            inputmode="numeric"
            :rules="[(v) => !v || /^\d{2}-\d{2}-\d{4}$/.test(v) || 'Use MM-DD-YYYY']"
          />
          <v-textarea
            v-model="localForm.content"
            label="Content"
            :rules="[(v) => !!v || 'Content is required']"
            required
            rows="4"
          />

          <v-switch
            v-model="localForm.pinned"
            label="Pin this note"
            color="primary"
            :disabled="
              !localForm.pinned && notesStore.notes.filter((n) => n.pinned).length >= MAX_PINS
            "
            :hint="`You can pin up to ${MAX_PINS} notes.`"
            persistent-hint
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="close">Close</v-btn>
        <v-btn color="primary" @click="saveNote">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
