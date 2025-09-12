import { defineStore, ref } from 'pinia'
// import { db } from '@/lib/firebaseClient'
// import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'

export const useClassesStore = defineStore('classes', () => {
  const classes = ref([])
  const loading = ref(false)
  const error = ref(null)
})
