import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebaseClient'

let idleTimer
const IDLE_MS = 5 * 60 * 1000 //5 minutes

function resetIdleTimer() {
  clearTimeout(idleTimer)
  idleTimer = setTimeout(() => {
    signOut(auth)
  }, IDLE_MS)
}

export function startIdleLogout() {
  const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart', 'visibilitychange']
  events.forEach((evt) => window.addEventListener(evt, resetIdleTimer, { passive: true }))
  resetIdleTimer()
}

export function stopIdleLogout() {
  clearTimeout(idleTimer)
}
