import { ref } from 'vue'
import { defineStore } from 'pinia'
import { doc, goalsCollection } from '@/lib/firebaseClient'
import { setDoc, updateDoc, getDocs, deleteDoc, query, where } from 'firebase/firestore'
import moment from 'moment'

const useGoalsStore = defineStore('goals', () => {
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

  const addGoal = async (data) => {
    const goalsData = {
      ...data,
      createdOn: moment().format(),
      updatedOn: moment().format()
    }

    const goalDocRef = doc(goalsCollection)
    await setDoc(goalDocRef, goalsData)
  }

  const getGoalsByGradeLevel = async ({ id, gradeLevel }) => {
    try {
      const q = query(
        goalsCollection,
        where('studentId', '==', id),
        where('gradeLevel', '==', gradeLevel)
      )
      const querySnapshot = await getDocs(q)

      const goalsList = []
      querySnapshot.forEach((docSnap) => {
        goalsList.push({ ...docSnap.data(), _docId: docSnap.id })
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

  const updateGoal = async (updatedGoal) => {
    try {
      if (!updatedGoal._docId) throw new Error('Missing document ID on goal')

      const docRef = doc(goalsCollection, updatedGoal._docId)
      const { _docId, ...goalData } = updatedGoal

      await updateDoc(docRef, {
        ...goalData,
        updatedOn: moment().format()
      })

      goals.value = goals.value.map((g) => (g._docId === _docId ? { ...updatedGoal } : g))

      console.log('✅ Goal updated')
    } catch (err) {
      console.error('❌ Error updating goal:', err)
    }
  }

  return {
    goals,
    modalIsVisible,
    showGoalsSidebar,
    currentChildProfile,
    selectedGoalRow,
    addGoalsModalVisible,
    toggleModal,
    addGoal,
    getGoalsByGradeLevel,
    updateGoal,
    toggleGoalsDrawer,
    toggleAddGoalsModal,
    deleteGoal
  }
})

export default useGoalsStore
