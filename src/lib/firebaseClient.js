// src/lib/firebaseClient.js
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth'
import {
  getFirestore,
  collection,
  doc,
  serverTimestamp,
  addDoc,
  setDoc,
  getDoc,
  updateDoc
} from 'firebase/firestore'

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

// Core services
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// Guard analytics so build/SSR doesn’t choke
const analytics =
  typeof window !== 'undefined' && typeof document !== 'undefined' ? getAnalytics(app) : undefined

// Optional: call this from main.js during bootstrap (no top-level await here)
export async function initFirebasePersistence() {
  try {
    await setPersistence(auth, browserSessionPersistence)
  } catch (err) {
    console.error('setPersistence failed:', err)
  }
}

// Collections
const usersCollection = collection(db, 'users')
const childrenCollection = collection(db, 'children')
const servicesCollection = collection(db, 'services')
const goalsCollection = collection(db, 'goals')
const notesCollection = collection(db, 'notes')

export {
  app,
  auth,
  analytics,
  db,
  usersCollection,
  childrenCollection,
  servicesCollection,
  goalsCollection,
  notesCollection,
  doc,
  serverTimestamp,
  addDoc,
  collection,
  setDoc,
  getDoc,
  updateDoc
}
