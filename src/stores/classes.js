import { defineStore } from 'pinia'
// import { db } from '@/lib/firebaseClient'
// import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'

export default defineStore('classes', {
  state: () => ({
    items: [] // flat array of class defs (recurring), each includes childId
  }),
  getters: {
    byChild: (s) => (childId) => s.items.filter((i) => i.childId === childId)
  },
  actions: {
    async fetchForChild(childId) {
      // Firestore (example):
      // const q = query(collection(db, 'classes'), where('childId', '==', childId))
      // const snap = await getDocs(q)
      // this.items = snap.docs.map(d => ({ id: d.id, ...d.data() }))

      // Demo fallback: no-op (keep current items)
      return this.byChild(childId)
    },
    async addClass(payload) {
      // const ref = await addDoc(collection(db, 'classes'), payload)
      // this.items.push({ ...payload, id: ref.id })
      this.items.push(payload)
    },
    async updateClass(payload) {
      // await updateDoc(doc(db, 'classes', payload.id), payload)
      const idx = this.items.findIndex((i) => i.id === payload.id)
      if (idx !== -1) this.items[idx] = { ...this.items[idx], ...payload }
    },
    async deleteClass(id) {
      // await deleteDoc(doc(db, 'classes', id))
      this.items = this.items.filter((i) => i.id !== id)
    }
  }
})
