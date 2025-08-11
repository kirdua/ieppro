// src/stores/services.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { servicesCollection } from '@/lib/firebaseClient'
import {
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore'

const useServicesStore = defineStore('services', () => {
  const currentServices = ref([])
  const addServiceModalVisible = ref(false)

  const toggleAddScheduledServicesModal = () => {
    addServiceModalVisible.value = !addServiceModalVisible.value
  }

  const getServicesByGradeLevel = async ({ id, gradeLevel }) => {
    try {
      const q = query(
        servicesCollection,
        where('childId', '==', id),
        where('gradeLevel', '==', gradeLevel)
      )
      const querySnapshot = await getDocs(q)
      const services = []
      querySnapshot.forEach((snap) => {
        services.push({ ...snap.data(), id: snap.id }) // keep Firestore doc id on the object
      })
      currentServices.value = services
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }

  const addScheduledService = async (serviceObj) => {
    try {
      const docRef = await addDoc(servicesCollection, {
        ...serviceObj,
        createdOn: serverTimestamp(),
        updatedOn: serverTimestamp()
      })
      // optimistic: push the new service into local list with returned id
      currentServices.value.unshift({ ...serviceObj, id: docRef.id })
    } catch (error) {
      console.error('Error adding service:', error)
    }
  }

  // ✅ UPDATE by Firestore doc id on the service object
  const updateScheduledService = async (updatedService) => {
    try {
      if (!updatedService?.id) throw new Error('Missing Firestore document id')

      const { id, ...data } = updatedService
      const docRef = doc(servicesCollection, id)

      await updateDoc(docRef, {
        ...data,
        updatedOn: serverTimestamp()
      })

      // keep local state in sync
      currentServices.value = currentServices.value.map((s) => (s.id === id ? { id, ...data } : s))
    } catch (error) {
      console.error('Error updating service:', error)
      throw error
    }
  }

  const deleteScheduledService = async (docId) => {
    try {
      if (!docId) throw new Error('Missing Firestore document id')
      await deleteDoc(doc(servicesCollection, docId))
      currentServices.value = currentServices.value.filter((s) => s.id !== docId)
    } catch (error) {
      console.error('Error deleting service:', error)
      throw error
    }
  }

  return {
    currentServices,
    addServiceModalVisible,
    toggleAddScheduledServicesModal,
    getServicesByGradeLevel,
    addScheduledService,
    updateScheduledService,
    deleteScheduledService
  }
})

export default useServicesStore
