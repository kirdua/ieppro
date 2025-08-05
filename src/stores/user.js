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
  const userLoggedIn = ref(userInfo.value !== null)

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

    const currentUser = {
      name,
      uid: userCred.user.uid
    }
    userLoggedIn.value = true
    localStorage.setItem('userInfo', JSON.stringify(currentUser))
    userInfo.value = currentUser
  }

  const login = async (values) => {
    try {
      console.log('🔥 login() function called')

      const { email, password } = values
      const userCred = await signInWithEmailAndPassword(auth, email, password)

      if (!userCred?.user) {
        console.error('❌ Login failed: No user returned')
        return
      }

      console.log('🔥 User credentials:', userCred)
      console.log('✅ Firebase Login Successful:', userCred.user.uid)

      const userDocRef = doc(usersCollection, userCred.user.uid)
      const userDoc = await getDoc(userDocRef)

      if (userDoc.exists()) {
        const userData = userDoc.data()
        console.log('✅ Firestore User Data:', userData)

        const currentUser = {
          name: userData.name,
          uid: userCred.user.uid
        }

        if (JSON.stringify(userInfo.value) === JSON.stringify(currentUser)) {
          console.log('⚠️ User info is already set, avoiding redundant updates')
          return
        }

        userInfo.value = currentUser
        localStorage.setItem('userInfo', JSON.stringify(currentUser))
        userLoggedIn.value = true

        console.log('✅ User Info Set:', userInfo.value)
      } else {
        console.error('❌ No user document found in Firestore')
      }
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
