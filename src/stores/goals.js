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
        goals.value = []
        return
      }

      const goalsList = []

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data()
        if (data.goals && Array.isArray(data.goals)) {
          data.goals.forEach((goal) => {
            goalsList.push({ ...goal, _docId: docSnap.id }) // Attach Firestore doc ID
          })
        }
      })

      goals.value = goalsList
    } catch (error) {
      console.error('Error fetching goals:', error)
      goals.value = []
    }
  }

  const deleteGoal = async (goalToDelete) => {
    try {
      const docRef = doc(goalsCollection, goalToDelete._docId)
      await deleteDoc(docRef)

      goals.value = goals.value.filter((g) => g._docId !== goalToDelete._docId)
    } catch (error) {
      console.error('❌ Error deleting goal document:', error)
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
    toggleAddGoalsModal,
    deleteGoal
  }
})

export default useGoalsStore
