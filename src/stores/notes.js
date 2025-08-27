// src/stores/notes.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  doc,
  getDoc
} from 'firebase/firestore'
import useUserStore from '@/stores/user'
import useChildrenStore from '@/stores/children'
import { notesCollection as notesCol } from '@/lib/firebaseClient'

const tsToMs = (t) => (t?.toMillis?.() ? t.toMillis() : t ? new Date(t).getTime() : 0)

export default defineStore('notes', () => {
  const userStore = useUserStore()
  const childrenStore = useChildrenStore()

  const notes = ref([])
  const isLoading = ref(false)
  const showEditor = ref(false) // <- for modal

  const childNameFor = (id) => {
    if (!id) return null
    const c = childrenStore.children.find((x) => x.id === id)
    return c?.name || [c?.firstName, c?.lastName].filter(Boolean).join(' ') || null
  }

  async function loadNotes() {
    if (!userStore?.userInfo?.uid) {
      console.warn('[notes] loadNotes: no uid')
      notes.value = []
      return
    }
    isLoading.value = true
    try {
      const qRef = query(notesCol, where('userId', '==', userStore.userInfo.uid))
      const snap = await getDocs(qRef)
      notes.value = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => tsToMs(b.updatedAt) - tsToMs(a.updatedAt))
    } catch (err) {
      console.error('[notes] loadNotes error:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function createNote({ title = '', content = '', childId, meetingDate = null }) {
    if (!userStore?.userInfo?.uid) {
      console.error('[notes] createNote: missing uid; are you logged in?')
      throw new Error('Not authenticated')
    }
    if (!childId) {
      console.error('[notes] createNote: childId required')
      throw new Error('childId is required')
    }

    const payload = {
      userId: userStore.userInfo.uid,
      title,
      content,
      childId,
      childName: childNameFor(childId),
      meetingDate,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    try {
      const refDoc = await addDoc(notesCol, payload)
      const fresh = await getDoc(doc(notesCol, refDoc.id))
      const newDoc = { id: refDoc.id, ...(fresh.exists() ? fresh.data() : payload) }
      notes.value.unshift(newDoc)
      notes.value.sort((a, b) => tsToMs(b.updatedAt) - tsToMs(a.updatedAt))
      return refDoc.id
    } catch (err) {
      console.error('[notes] createNote failed:', err)
      throw err
    }
  }

  async function updateNote(id, patch) {
    if ('childId' in patch && !patch.childId) {
      throw new Error('childId is required')
    }
    if ('childId' in patch && patch.childId) {
      patch.childName = childNameFor(patch.childId)
    }
    try {
      await updateDoc(doc(notesCol, id), { ...patch, updatedAt: serverTimestamp() })
      const idx = notes.value.findIndex((n) => n.id === id)
      if (idx !== -1) notes.value[idx] = { ...notes.value[idx], ...patch }
      notes.value.sort((a, b) => tsToMs(b.updatedAt) - tsToMs(a.updatedAt))
    } catch (err) {
      console.error('[notes] updateNote failed:', err)
      throw err
    }
  }

  async function removeNote(id) {
    try {
      await deleteDoc(doc(notesCol, id))
      notes.value = notes.value.filter((n) => n.id !== id)
    } catch (err) {
      console.error('[notes] removeNote failed:', err)
      throw err
    }
  }

  return { notes, isLoading, showEditor, loadNotes, createNote, updateNote, removeNote }
})
