<!-- src/views/notes/components/AddNoteModal.vue -->
<script setup>
import { ref, watch, computed } from 'vue'
import { toast } from 'vue3-toastify'
import useNotesStore from '@/stores/notes'
import useChildrenStore from '@/stores/children'

const emit = defineEmits(['note-added'])

const notesStore = useNotesStore()
const childrenStore = useChildrenStore()

// local form state
const valid = ref(false)
const form = ref({
  title: '',
  content: '',
  meetingDate: '' // MM/DD/YYYY string
})

// show the selected child’s display name
const selectedChildName = computed(() => {
  const id = notesStore.currentChildProfile?.id
  const c = childrenStore.children.find((x) => x.id === id)
  return c?.name || [c?.firstName, c?.lastName].filter(Boolean).join(' ') || '—'
})

// reset form when modal opens
watch(
  () => notesStore.noteModalIsVisible,
  (open) => {
    if (open) {
      if (notesStore.editNote && notesStore.selectedNote) {
        const n = notesStore.selectedNote
        form.value = {
          title: n.title || '',
          content: n.content || '',
          meetingDate: n.meetingDate || ''
        }
      } else {
        form.value = { title: '', content: '', meetingDate: '' }
      }
    }
  }
)

const close = () => {
  notesStore.closeNoteModal()
}

const saveNote = async () => {
  const childId = notesStore.currentChildProfile?.id
  const gradeLevel = notesStore.currentChildProfile?.gradeLevel || ''

  if (!childId) {
    toast.error('Please select a child first.')
    return
  }
  if (!valid.value) return

  try {
    const payload = {
      title: form.value.title,
      content: form.value.content,
      meetingDate: form.value.meetingDate, // plain MM/DD/YYYY string
      childId,
      currentGrade: gradeLevel
    }

    if (notesStore.editNote && notesStore.selectedNote?.id) {
      await notesStore.updateNote({ id: notesStore.selectedNote.id, ...payload })
      toast.success('Note updated successfully!')
    } else {
      await notesStore.addNote({ ...payload, pinned: false })
      toast.success('Note added successfully!')
    }

    emit('note-added')
    close()
  } catch (err) {
    console.error('Error saving note:', err)
    toast.error('Failed to save note. Please try again.')
  }
}
</script>

<template>
  <v-dialog v-model="notesStore.noteModalIsVisible" max-width="720">
    <v-card class="rounded-xl">
      <v-card-title class="d-flex justify-space-between align-center text-primary">
        <span>{{ notesStore.editNote ? 'Edit Note' : 'New Note' }}</span>
        <v-btn icon="mdi-close" variant="text" @click="close" />
      </v-card-title>

      <v-card-text>
        <div class="mb-3 d-flex flex-wrap ga-3 align-center justify-end">
          <v-chip variant="tonal" size="small">Child: {{ selectedChildName }}</v-chip>
          <v-chip variant="tonal" size="small" v-if="notesStore.currentChildProfile?.gradeLevel">
            Grade: {{ notesStore.currentChildProfile.gradeLevel }}
          </v-chip>
        </div>

        <v-form v-model="valid" lazy-validation>
          <v-text-field v-model="form.title" label="Title" density="comfortable" />

          <v-text-field
            v-model="form.meetingDate"
            label="Meeting Date"
            placeholder="MM/DD/YYYY"
            :rules="[(v) => !v || /^\d{2}\/\d{2}\/\d{4}$/.test(v) || 'Use MM/DD/YYYY']"
          />

          <v-textarea
            v-model="form.content"
            label="Notes"
            :rules="[(v) => !!v || 'Notes are required']"
            required
            rows="6"
            auto-grow
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="close">Close</v-btn>
        <v-btn color="primary" :disabled="!valid" @click="saveNote">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
