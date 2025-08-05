// servicesStore.js or services.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { servicesCollection } from '@/lib/firebaseClient'
import { addDoc, getDocs, query, where } from 'firebase/firestore'

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
      querySnapshot.forEach((doc) => services.push({ ...doc.data(), id: doc.id }))
      currentServices.value = services
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }

  const addScheduledService = async (serviceObj) => {
    try {
      await addDoc(servicesCollection, serviceObj)
    } catch (error) {
      console.error('Error adding service:', error)
    }
  }

  return {
    currentServices,
    getServicesByGradeLevel,
    addScheduledService,
    addServiceModalVisible,
    toggleAddScheduledServicesModal
  }
})

export default useServicesStore
