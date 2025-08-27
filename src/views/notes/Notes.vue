<!-- src/views/notes/NotesHub.vue -->
<script setup>
import { ref, onMounted, computed } from 'vue'
import useNotesStore from '@/stores/notes'
import useChildrenStore from '@/stores/children'
import useUserStore from '@/stores/user'

const userStore = useUserStore()
const notesStore = useNotesStore()
const childrenStore = useChildrenStore()

const editingId = ref(null)
const valid = ref(false)

const form = ref({
  title: '',
  content: '',
  childId: null, // REQUIRED
  meetingDate: null
})

const childItems = computed(() =>
  childrenStore.children.map((c) => ({
    title: c.name || [c.firstName, c.lastName].filter(Boolean).join(' ') || 'Child',
    value: c.id
  }))
)

const childNameById = (id) => {
  const c = childrenStore.children.find((x) => x.id === id)
  return c?.name || [c?.firstName, c?.lastName].filter(Boolean).join(' ') || 'Linked'
}

function openNew() {
  editingId.value = null
  form.value = { title: '', content: '', childId: null, meetingDate: null }
  notesStore.showEditor = true
}

function openEdit(n) {
  editingId.value = n.id
  form.value = {
    title: n.title || '',
    content: n.content || '',
    childId: n.childId || null,
    meetingDate: n.meetingDate || null
  }
  notesStore.showEditor = true
}

async function saveNote() {
  if (!valid.value) return
  if (editingId.value) {
    await notesStore.updateNote(editingId.value, { ...form.value })
  } else {
    await notesStore.createNote({ ...form.value })
  }
  notesStore.showEditor = false
}

async function remove(id) {
  await notesStore.removeNote(id)
}

onMounted(async () => {
  // load children for this parent
  await childrenStore.getChildrenProfiles(userStore.userInfo.uid)
  // load notes (no orderBy -> no composite index)
  await notesStore.loadNotes()
})
</script>

<template>
  <div>
    <v-container class="pt-4">
      <div v-if="notesStore.isLoading" class="text-center mt-4">
        <v-progress-circular indeterminate color="primary" />
        <div class="mt-2">Loading Goals...</div>
      </div>

      <v-empty-state
        v-else-if="notesStore.notes.length === 0"
        headline="No notes yet"
        text="Create your first ARD/IEP note."
      >
        <template #actions>
          <v-btn color="primary" @click="openNew">Add Note</v-btn>
        </template>
      </v-empty-state>

      <v-row v-else dense>
        <v-col cols="12" md="6" lg="4" v-for="n in notesStore.notes" :key="n.id">
          <v-card class="rounded-lg" variant="elevated">
            <v-card-title class="d-flex justify-space-between align-center">
              <span class="text-truncate">{{ n.title || 'Untitled' }}</span>
              <div class="d-flex align-center ga-2">
                <span class="text-caption" v-if="n.meetingDate">{{ n.meetingDate }}</span>
                <v-chip size="x-small" variant="tonal">{{ childNameById(n.childId) }}</v-chip>
              </div>
            </v-card-title>
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
                {{ n.content || '—' }}
              </div>
            </v-card-text>
            <v-card-actions class="justify-space-between">
              <div class="d-flex ga-1">
                <v-btn size="small" variant="text" @click="openEdit(n)">Edit</v-btn>
                <v-btn size="small" variant="text" color="error" @click="remove(n.id)"
                  >Delete</v-btn
                >
              </div>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Editor Dialog -->
    <v-dialog v-model="notesStore.showEditor" max-width="720">
      <v-card class="rounded-xl">
        <v-card-title class="d-flex justify-space-between align-center">
          <span>{{ editingId ? 'Edit Note' : 'New Note' }}</span>
          <v-btn icon="mdi-close" variant="text" @click="notesStore.showEditor = false" />
        </v-card-title>

        <v-card-text class="pt-0">
          <v-form v-model="valid">
            <v-text-field v-model="form.title" label="Title (optional)" class="mb-2" />
            <div class="d-flex ga-2 flex-wrap mb-2">
              <v-select
                :items="childItems"
                v-model="form.childId"
                label="Child *"
                :rules="[(v) => !!v || 'Select a child']"
                density="compact"
                style="min-width: 260px"
              />
              <v-text-field
                v-model="form.meetingDate"
                label="Meeting Date"
                type="date"
                density="compact"
                style="max-width: 200px"
              />
            </div>
            <v-textarea v-model="form.content" label="Notes" auto-grow rows="8" />
          </v-form>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="notesStore.showEditor = false">Close</v-btn>
          <v-btn color="primary" :disabled="!valid" @click="saveNote">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
