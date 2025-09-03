<!-- src/views/notes/components/AddNoteModal.vue -->
<script setup>
import { ref, watch, computed } from 'vue'
import { toast } from 'vue3-toastify'
import useNotesStore from '@/stores/notes'
import useChildrenStore from '@/stores/children'

const emit = defineEmits(['note-added'])

const notesStore = useNotesStore()
const childrenStore = useChildrenStore()

const valid = ref(false)
const saving = ref(false)
const form = ref({
  title: '',
  content: '',
  meetingDate: '' // MM/DD/YYYY string
})

// display
const selectedChildName = computed(() => {
  const id = notesStore.currentChildProfile?.id
  const c = childrenStore.children.find((x) => x.id === id)
  return c?.name || [c?.firstName, c?.lastName].filter(Boolean).join(' ') || '—'
})
const selectedGrade = computed(() => notesStore.currentChildProfile?.gradeLevel || '—')

// reset form
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
  if (saving.value) return
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
    saving.value = true
    const payload = {
      title: form.value.title,
      content: form.value.content,
      meetingDate: form.value.meetingDate,
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
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <v-dialog v-model="notesStore.noteModalIsVisible" max-width="720">
    <v-card class="rounded-xl" elevation="10">
      <!-- Header -->
      <v-card-title class="py-3 bg-primary text-white rounded-t-xl">
        <div class="d-flex align-center w-100">
          <div>
            <div class="text-h6 font-weight-semibold">
              {{ notesStore.editNote ? 'Edit Note' : 'New Note' }}
            </div>
            <div class="text-caption opacity-80">
              Capture meeting details and follow-ups for this child.
            </div>
          </div>
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" @click="close" :disabled="saving" color="white" />
        </div>
      </v-card-title>

      <!-- Chips -->
      <v-card-text class="pt-4 pb-2">
        <div class="d-flex flex-wrap ga-2 justify-end">
          <v-chip color="primary" text-color="white" size="small" prepend-icon="mdi-account-child">
            {{ selectedChildName }}
          </v-chip>
          <v-chip color="secondary" text-color="white" size="small" prepend-icon="mdi-school">
            Grade: {{ selectedGrade }}
          </v-chip>
        </div>
      </v-card-text>

      <!-- Form -->
      <v-card-text>
        <v-form v-model="valid" lazy-validation class="d-flex flex-column ga-4">
          <v-text-field
            v-model="form.title"
            label="Title"
            density="comfortable"
            prepend-inner-icon="mdi-note-edit-outline"
            color="primary"
          />

          <v-text-field
            v-model="form.meetingDate"
            label="Meeting Date"
            placeholder="MM/DD/YYYY"
            :rules="[(v) => !v || /^\d{2}\/\d{2}\/\d{4}$/.test(v) || 'Use MM/DD/YYYY']"
            prepend-inner-icon="mdi-calendar"
            hint="Optional • Stored as MM/DD/YYYY"
            persistent-hint
            color="primary"
          />

          <v-textarea
            v-model="form.content"
            label="Notes"
            :rules="[(v) => !!v || 'Notes are required']"
            required
            rows="6"
            auto-grow
            prepend-inner-icon="mdi-text-long"
            hint="Key points, decisions, action items."
            persistent-hint
            color="primary"
          />
        </v-form>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions class="justify-end pa-4">
        <v-btn variant="tonal" color="secondary" @click="close" :disabled="saving">Cancel</v-btn>
        <v-btn color="primary" :loading="saving" :disabled="!valid || saving" @click="saveNote">
          {{ notesStore.editNote ? 'Save Changes' : 'Save Note' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
