import { ref } from 'vue'
import { defineStore } from 'pinia'
import { doc, goalsCollection } from '@/lib/firebaseClient'
import { setDoc, getDoc, getDocs, deleteDoc, query, where } from 'firebase/firestore'
import moment from 'moment'

const useGoalsStore = defineStore('goals', () => {
  const formatDate = moment().format()
  const goals = ref([])
  const modalIsVisible = ref(false)
  const currentChildProfile = ref({})
  const showGoalsSidebar = ref(false)
  const selectedGoalRow = ref({})
  const addGoalsModalVisible = ref(false)

  const toggleModal = () => {
    modalIsVisible.value = !modalIsVisible.value
  }

  const toggleGoalsDrawer = (showHide) => {
    showGoalsSidebar.value = showHide
  }

  const toggleAddGoalsModal = () => {
    addGoalsModalVisible.value = !addGoalsModalVisible.value
  }

  const addGoalsToGradeLevel = async (data) => {
    const goalsData = {
      ...data,
      createdOn: formatDate,
      updatedOn: formatDate
    }

    const goalDocRef = doc(goalsCollection)
    await setDoc(goalDocRef, goalsData)
  }

  const getGoalsByGradeLevel = async ({ id, gradeLevel }) => {
    try {
      const q = query(goalsCollection, where('id', '==', id), where('grade', '==', gradeLevel))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        console.log('No matching documents.')
      }

      const goalsList = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        if (data.goals) {
          goalsList.push(...data.goals) // Extracting and adding the goals array to goalsList
        }
      })
      goals.value = goalsList
    } catch (error) {
      console.error('Error fetching goals:', error)
    }
  }

  const updateGoalsByGradeLevel = () => {}
  return {
    goals,
    modalIsVisible,
    showGoalsSidebar,
    currentChildProfile,
    selectedGoalRow,
    addGoalsModalVisible,
    toggleModal,
    addGoalsToGradeLevel,
    getGoalsByGradeLevel,
    updateGoalsByGradeLevel,
    toggleGoalsDrawer,
    toggleAddGoalsModal
  }
})

export default useGoalsStore
