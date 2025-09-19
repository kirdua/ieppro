import { ref } from 'vue'
import { defineStore } from 'pinia'
import { doc, goalsCollection } from '@/lib/firebaseClient'
import { setDoc, updateDoc, getDocs, deleteDoc, query, where } from 'firebase/firestore'
import moment from 'moment'

const useGoalsStore = defineStore('goals', () => {
  // Data
  const goals = ref([])
  const isLoading = ref(false)
  const error = ref('')

  // UI state you already had
  const modalIsVisible = ref(false)
  const currentChildProfile = ref({})
  const showGoalsSidebar = ref(false)
  const selectedGoalRow = ref({})
  const addGoalsModalVisible = ref(false)

  // NEW: view context controlled by AppBar
  const viewMode = ref('grade') // 'grade' | 'subject'
  const subjectFilter = ref(null) // string | null
  const childContext = ref(null) // string | null
  const gradeContext = ref('') // string

  // UI toggles
  const toggleModal = () => {
    modalIsVisible.value = !modalIsVisible.value
  }
  const toggleGoalsDrawer = (showHide) => {
    showGoalsSidebar.value = showHide
  }
  const toggleAddGoalsModal = () => {
    addGoalsModalVisible.value = !addGoalsModalVisible.value
  }

  // Create
  const addGoal = async (data) => {
    const goalsData = {
      ...data,
      createdOn: moment().format(),
      updatedOn: moment().format()
    }
    const goalDocRef = doc(goalsCollection)
    await setDoc(goalDocRef, goalsData)
  }

  // Legacy method (kept for compatibility); now a thin wrapper
  const getGoalsByGradeLevel = async ({ id, gradeLevel }) => {
    viewMode.value = 'grade'
    subjectFilter.value = null
    childContext.value = id
    gradeContext.value = gradeLevel || ''
    await refresh()
  }

  // NEW: single place to set current viewing context
  const setContext = ({ viewMode: vm, subject, childId, grade } = {}) => {
    if (vm) viewMode.value = vm
    if (childId !== undefined) childContext.value = childId
    if (grade !== undefined) gradeContext.value = grade || ''
    // keep subject only when in subject mode
    subjectFilter.value = viewMode.value === 'subject' ? (subject ?? null) : null
  }

  // NEW: fetch based on current context
  const refresh = async () => {
    if (!childContext.value) return
    isLoading.value = true
    error.value = ''
    try {
      let qRef
      if (viewMode.value === 'subject' && subjectFilter.value) {
        // Subject across entire academic career (ignore grade)
        qRef = query(
          goalsCollection,
          where('studentId', '==', childContext.value),
          where('goalSubject', '==', subjectFilter.value)
        )
      } else {
        // Grade-specific
        qRef = query(
          goalsCollection,
          where('studentId', '==', childContext.value),
          where('gradeLevel', '==', gradeContext.value || '')
        )
      }

      const snap = await getDocs(qRef)
      const list = []
      snap.forEach((docSnap) => list.push({ ...docSnap.data(), _docId: docSnap.id }))
      goals.value = list
    } catch (e) {
      console.error('Error fetching goals:', e)
      error.value = e?.message || 'Failed to fetch goals.'
      goals.value = []
    } finally {
      isLoading.value = false
    }
  }

  // Delete
  const deleteGoal = async (goalToDelete) => {
    try {
      const docRef = doc(goalsCollection, goalToDelete._docId)
      await deleteDoc(docRef)
      goals.value = goals.value.filter((g) => g._docId !== goalToDelete._docId)
    } catch (err) {
      console.error('❌ Error deleting goal document:', err)
    }
  }

  // Update
  const updateGoal = async (updatedGoal) => {
    try {
      if (!updatedGoal._docId) throw new Error('Missing document ID on goal')
      const docRef = doc(goalsCollection, updatedGoal._docId)
      const { _docId, ...goalData } = updatedGoal
      await updateDoc(docRef, { ...goalData, updatedOn: moment().format() })
      goals.value = goals.value.map((g) => (g._docId === _docId ? { ...updatedGoal } : g))
      console.log('✅ Goal updated')
    } catch (err) {
      console.error('❌ Error updating goal:', err)
    }
  }

  return {
    goals,
    isLoading,
    error,
    modalIsVisible,
    currentChildProfile,
    showGoalsSidebar,
    selectedGoalRow,
    addGoalsModalVisible,
    viewMode,
    subjectFilter,
    childContext,
    gradeContext,
    toggleModal,
    toggleGoalsDrawer,
    toggleAddGoalsModal,
    addGoal,
    getGoalsByGradeLevel, // legacy wrapper
    updateGoal,
    deleteGoal,
    setContext,
    refresh
  }
})

export default useGoalsStore
