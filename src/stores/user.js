import { defineStore } from 'pinia'
import { auth, usersCollection, doc } from '@/lib/firebaseClient'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { setDoc, getDoc, updateDoc } from 'firebase/firestore'
import moment from 'moment'
import { ref } from 'vue'
import { useCloudinary } from '@/composables/useCloudinary'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(
    localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
  )
  const userLoggedIn = ref(!!userInfo.value)

  const { uploadToCloudinary } = useCloudinary()

  const register = async (values) => {
    const { email, password, name, tos } = values
    const userCred = await createUserWithEmailAndPassword(auth, email, password)
    const userDocRef = doc(usersCollection, userCred.user.uid)

    const formatDate = moment().format()

    await setDoc(userDocRef, {
      parentId: userCred.user.uid,
      name,
      email,
      tos,
      createdAt: formatDate,
      updatedAt: formatDate
    })

    const currentUser = { name, uid: userCred.user.uid }
    // Ensure flags are set immediately after success
    userInfo.value = currentUser
    localStorage.setItem('userInfo', JSON.stringify(currentUser))
    userLoggedIn.value = true
  }

  const login = async (values) => {
    try {
      const { email, password } = values
      const userCred = await signInWithEmailAndPassword(auth, email, password)
      if (!userCred?.user) return

      const userDocRef = doc(usersCollection, userCred.user.uid)
      const userDoc = await getDoc(userDocRef)

      let name = ''
      if (userDoc.exists()) {
        const userData = userDoc.data()
        name = userData?.name || ''
      }

      const currentUser = { name, uid: userCred.user.uid }

      // ✅ FIX: no early return before setting flags
      userInfo.value = currentUser
      localStorage.setItem('userInfo', JSON.stringify(currentUser))
      userLoggedIn.value = true
    } catch (error) {
      console.error('❌ Login error:', error)
    }
  }

  const logout = async () => {
    await signOut(auth)
    localStorage.removeItem('userInfo')
    userLoggedIn.value = false
    userInfo.value = null
  }

  const fetchUserProfile = async () => {
    if (!userInfo.value?.uid) return
    const userDocRef = doc(usersCollection, userInfo.value.uid)
    const userDoc = await getDoc(userDocRef)
    if (userDoc.exists()) {
      userInfo.value = { ...userInfo.value, ...userDoc.data() }
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
    }
  }

  const updateUserProfile = async (updates) => {
    if (!userInfo.value?.uid) return
    const userDocRef = doc(usersCollection, userInfo.value.uid)
    const formatDate = moment().format()

    try {
      if (updates.profilePic) {
        const profilePicUrl = await uploadToCloudinary(updates.profilePic)
        if (profilePicUrl) updates.profilePicUrl = profilePicUrl
        delete updates.profilePic
      }

      updates.updatedAt = formatDate
      await updateDoc(userDocRef, updates)
      userInfo.value = { ...userInfo.value, ...updates }
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
    } catch (error) {
      console.error('Error updating user profile:', error)
    }
  }

  return {
    userInfo,
    userLoggedIn,
    register,
    login,
    logout,
    fetchUserProfile,
    updateUserProfile
  }
})

export default useUserStore
