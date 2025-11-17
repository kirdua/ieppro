// src/stores/classes.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '@/lib/firebaseClient'
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  startAt,
  endAt,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore'
import { mmddyyyyToDate, dateToMmddyyyy, addDays, buildDateFromMmddyyyyAndTime } from '@/utils/date'

/**
 * Class shape in `classes`:
 * {
 *   id, childId, gradeLevel, title, teacher, location, color,
 *   startDate: 'MM-DD-YYYY',
 *   endDate:   'MM-DD-YYYY',
 *   startTime: 'HH:mm',
 *   endTime:   'HH:mm',
 *   daysOfWeek: number[], // 0..6
 *   exceptions?: string[], // 'MM-DD-YYYY'
 *   createdAt, updatedAt
 * }
 *
 * Occurrence shape in `schedule_occurrences`:
 * {
 *   id,
 *   classId, childId, gradeLevel,
 *   dateISO: 'MM-DD-YYYY',
 *   startTime, endTime, startMinutes, endMinutes,
 *   title, teacher, location, color,
 *   createdAt, updatedAt
 * }
 */

const CLASSES_COL = 'classes'
const OCC_COL = 'schedule_occurrences'
const BATCH_LIMIT = 450 // safety under 500 limit

const toMinutes = (hhmm) => {
  const [h, m] = String(hhmm).split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

export const useClassesStore = defineStore('classes', () => {
  const classes = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchClasses(childId, gradeLevel) {
    loading.value = true
    error.value = null
    try {
      const qy = query(
        collection(db, CLASSES_COL),
        where('childId', '==', childId),
        where('gradeLevel', '==', String(gradeLevel)),
        orderBy('title')
      )
      const snap = await getDocs(qy)
      classes.value = snap.docs.map((d) => d.data())
    } catch (e) {
      error.value = e
      console.error('fetchClasses error', e)
    } finally {
      loading.value = false
    }
  }

  async function addClass(cls) {
    if (!cls.childId || !cls.gradeLevel) {
      throw new Error('childId and gradeLevel are required')
    }
    const id = crypto.randomUUID()
    const base = {
      id,
      ...cls,
      gradeLevel: String(cls.gradeLevel),
      exceptions: Array.isArray(cls.exceptions) ? cls.exceptions : [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    await setDoc(doc(db, CLASSES_COL, id), base)
    await regenerateOccurrencesForClass(base)
    classes.value.push(base)
    return id
  }

  async function updateClass(id, patch) {
    const refDoc = doc(db, CLASSES_COL, id)
    await updateDoc(refDoc, { ...patch, updatedAt: serverTimestamp() })
    const i = classes.value.findIndex((c) => c.id === id)
    const merged = i !== -1 ? { ...classes.value[i], ...patch } : { id, ...patch }
    if (i !== -1) classes.value[i] = merged
    await deleteOccurrencesByClass(id)
    await regenerateOccurrencesForClass(merged)
  }

  async function deleteClass(id) {
    await deleteDoc(doc(db, CLASSES_COL, id))
    await deleteOccurrencesByClass(id)
    classes.value = classes.value.filter((c) => c.id !== id)
  }

  async function deleteOccurrencesByClass(classId) {
    const qy = query(collection(db, OCC_COL), where('classId', '==', classId), orderBy('dateISO'))
    const snap = await getDocs(qy)
    let batch = writeBatch(db)
    let count = 0
    for (const d of snap.docs) {
      batch.delete(d.ref)
      count++
      if (count >= BATCH_LIMIT) {
        await batch.commit()
        batch = writeBatch(db)
        count = 0
      }
    }
    if (count > 0) await batch.commit()
  }

  async function regenerateOccurrencesForClass(c) {
    const exceptions = new Set(c.exceptions || [])
    let cursor = mmddyyyyToDate(c.startDate)
    const end = mmddyyyyToDate(c.endDate)

    let batch = writeBatch(db)
    let count = 0

    while (cursor <= end) {
      const iso = dateToMmddyyyy(cursor)
      const dow = cursor.getDay()

      if (c.daysOfWeek.includes(dow) && !exceptions.has(iso)) {
        const ref = doc(collection(db, OCC_COL))
        batch.set(ref, {
          id: ref.id,
          classId: c.id,
          childId: c.childId,
          gradeLevel: c.gradeLevel,
          dateISO: iso, // MM-DD-YYYY
          startTime: c.startTime,
          endTime: c.endTime,
          startMinutes: toMinutes(c.startTime),
          endMinutes: toMinutes(c.endTime),
          title: c.title,
          teacher: c.teacher || '',
          location: c.location || '',
          color: c.color || 'blue',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
        count++
        if (count >= BATCH_LIMIT) {
          await batch.commit()
          batch = writeBatch(db)
          count = 0
        }
      }
      cursor = addDays(cursor, 1)
    }
    if (count > 0) await batch.commit()
  }

  /** Fetch events for v-calendar between two Dates for a child+grade. */
  async function fetchEventsBetween(childId, gradeLevel, startDate, endDate) {
    const startKey = dateToMmddyyyy(startDate)
    const endKey = dateToMmddyyyy(endDate)

    const qy = query(
      collection(db, OCC_COL),
      where('childId', '==', childId),
      where('gradeLevel', '==', String(gradeLevel)),
      orderBy('dateISO'),
      startAt(startKey),
      endAt(endKey)
    )

    const snap = await getDocs(qy)
    return snap.docs.map((d) => {
      const e = d.data()
      return {
        title: e.title,
        start: buildDateFromMmddyyyyAndTime(e.dateISO, e.startTime),
        end: buildDateFromMmddyyyyAndTime(e.dateISO, e.endTime),
        color: e.color,
        allDay: false,
        data: e
      }
    })
  }

  return {
    // state
    classes,
    loading,
    error,
    // actions
    fetchClasses,
    addClass,
    updateClass,
    deleteClass,
    fetchEventsBetween
  }
})
