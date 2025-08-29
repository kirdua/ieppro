// src/stores/notes.js
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { doc, addDoc, auth, notesCollection } from '@/lib/firebaseClient'
import moment from 'moment'

const useNotesStore = defineStore('notes', () => {
  const notes = ref([])
  const noteModalIsVisible = ref(false)

  // CREATE
  const addNote = async (data = {}) => {
    const uid = auth.currentUser?.uid
    if (!uid) throw new Error('Not signed in')

    const note = {
      title: data.title,
      content: data.content,
      childId: data.childId,
      meetingDate: data.meetingDate,
      pinned: !!data.pinned,
      parentId: uid,
      createdOn: moment().format(),
      updatedOn: moment().format()
    }

    await addDoc(notesCollection, note) // ← this creates the collection if missing
  }

  // READ (ALL notes for now)
  const getNotes = async () => {}

  // stubs for later
  const deleteNote = async () => {}
  const updateNote = async () => {}

  return {
    notes,
    noteModalIsVisible,
    addNote,
    getNotes,
    updateNote,
    deleteNote
  }
})

export default useNotesStore
