import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  doc
} from 'firebase/firestore'
import useUserStore from '@/stores/user'
import { notesCollection } from '@/lib/firebaseClient'

const useNotesStore = defineStore('notes', () => {
  const userStore = useUserStore()

  // ---- state (mirrors Child Profile store) ----
  const notes = ref([])
  const noteModalIsVisible = ref(false)
  const editNote = ref(false) // like children.editProfile
  const selectedNote = ref(null) // like children.selectedChildProfile
  const currentChildProfile = ref({
    // like children.currentChildProfile
    id: null,
    gradeLevel: ''
  })

  // ---- open/close (mirrors child modal toggles) ----
  const openNewNote = () => {
    editNote.value = false
    selectedNote.value = null
    noteModalIsVisible.value = true
  }

  const openEditNote = (note) => {
    editNote.value = true
    selectedNote.value = note || null
    noteModalIsVisible.value = true
  }

  const closeNoteModal = () => {
    noteModalIsVisible.value = false
    editNote.value = false
    selectedNote.value = null
  }

  // ---- CRUD ----
  const addNote = async (data) => {
    const uid = userStore?.userInfo?.uid
    if (!uid) throw new Error('Not authenticated')

    const payload = {
      userId: uid,
      title: data.title || '',
      content: data.content || '',
      meetingDate: data.meetingDate || null, // MM/DD/YYYY
      childId: data.childId || currentChildProfile.value.id,
      currentGrade: data.currentGrade ?? currentChildProfile.value.gradeLevel,
      pinned: !!data.pinned,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    const refDoc = await addDoc(notesCollection, payload)
    notes.value.unshift({ id: refDoc.id, ...payload })
  }

  const updateNote = async (updated) => {
    if (!updated?.id) throw new Error('Missing note id')
    const { id, ...data } = updated
    const refDoc = doc(notesCollection, id)
    await updateDoc(refDoc, { ...data, updatedAt: serverTimestamp() })
    notes.value = notes.value.map((n) => (n.id === id ? { id, ...data } : n))
  }

  const deleteNote = async (note) => {
    const id = typeof note === 'string' ? note : note?.id
    if (!id) throw new Error('Missing note id')
    await deleteDoc(doc(notesCollection, id))
    notes.value = notes.value.filter((n) => n.id !== id)
  }

  // Fetch by child + grade (same shape as Goals)
  const getNotesByGradeLevel = async ({ id, gradeLevel }) => {
    try {
      const uid = userStore?.userInfo?.uid
      if (!uid || !id || !gradeLevel) {
        notes.value = []
        return
      }
      const qRef = query(
        notesCollection,
        where('userId', '==', uid),
        where('childId', '==', id),
        where('currentGrade', '==', gradeLevel)
      )
      const snap = await getDocs(qRef)
      const list = []
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }))
      notes.value = list
    } catch (e) {
      console.error('Error fetching notes:', e)
      notes.value = []
    }
  }

  return {
    notes,
    noteModalIsVisible,
    editNote,
    selectedNote,
    currentChildProfile,
    openNewNote,
    openEditNote,
    closeNoteModal,
    addNote,
    updateNote,
    deleteNote,
    getNotesByGradeLevel
  }
})

export default useNotesStore
