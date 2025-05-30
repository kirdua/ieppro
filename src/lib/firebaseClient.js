import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore, collection, doc, serverTimestamp, addDoc } from 'firebase/firestore'

const apiKey = import.meta.env.VITE_FIREBASE_APIKEY
const authDomain = import.meta.env.VITE_FIREBASE_AUTHDOMAIN
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID
const appId = import.meta.env.VITE_FIREBASE_APP_ID
const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const analytics = getAnalytics(app)
const db = getFirestore(app)

const usersCollection = collection(db, 'users')
const childrenCollection = collection(db, 'children')
const servicesCollection = collection(db, 'services')
const goalsCollection = collection(db, 'goals')

export {
  app,
  auth,
  analytics,
  db,
  usersCollection,
  childrenCollection,
  servicesCollection,
  goalsCollection,
  doc,
  serverTimestamp,
  addDoc,
  collection
}
