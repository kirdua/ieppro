import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth, usersCollection, doc } from '@/lib/firebaseClient'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import { getDoc, setDoc, updateDoc } from 'firebase/firestore'

let initPromise

export default defineStore('user', () => {
  const userInfo = ref(null) // { uid, name?, email? ... }
  const userLoggedIn = ref(false)
  const isAuthReady = ref(false)

  function initAuth() {
    if (initPromise) return initPromise
    initPromise = new Promise((resolve) => {
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          userInfo.value = null
          userLoggedIn.value = false
          isAuthReady.value = true
          resolve()
          return
        }
        const snap = await getDoc(doc(usersCollection, user.uid))
        userInfo.value = { uid: user.uid, ...(snap.exists() ? snap.data() : {}) }
        userLoggedIn.value = true
        isAuthReady.value = true
        resolve()
      })
    })
    return initPromise
  }

  async function register({ email, password, name = '', tos = false }) {
    if (!email || !password) throw new Error('auth/missing-credentials')
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password)
    const now = new Date().toISOString()
    await setDoc(doc(usersCollection, cred.user.uid), {
      parentId: cred.user.uid,
      name,
      email: email.trim(),
      tos,
      createdAt: now,
      updatedAt: now
    })
    // listener will update state
  }

  async function login({ email, password }) {
    if (!email || !password) throw new Error('auth/missing-credentials')
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password)
    const snap = await getDoc(doc(usersCollection, cred.user.uid))
    userInfo.value = { uid: cred.user.uid, ...(snap.exists() ? snap.data() : {}) }
    userLoggedIn.value = true
  }

  async function logout() {
    await signOut(auth)
    // listener clears state
  }

  async function fetchUserProfile() {
    if (!userInfo.value?.uid) return
    const snap = await getDoc(doc(usersCollection, userInfo.value.uid))
    if (snap.exists()) userInfo.value = { uid: userInfo.value.uid, ...snap.data() }
  }

  async function updateUserProfile(updates) {
    if (!userInfo.value?.uid) return
    const now = new Date().toISOString()
    await updateDoc(doc(usersCollection, userInfo.value.uid), { ...updates, updatedAt: now })
    await fetchUserProfile()
  }

  return {
    userInfo,
    userLoggedIn,
    isAuthReady,
    initAuth,
    register,
    login,
    logout,
    fetchUserProfile,
    updateUserProfile
  }
})
