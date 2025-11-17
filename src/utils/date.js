// src/utils/date.js
export function mmddyyyyToParts(mmddyyyy) {
  const [M, D, Y] = String(mmddyyyy).split('-').map(Number)
  return { Y, M, D }
}

export function mmddyyyyToDate(mmddyyyy) {
  const { Y, M, D } = mmddyyyyToParts(mmddyyyy)
  return new Date(Y, (M || 1) - 1, D || 1)
}

export function dateToMmddyyyy(date) {
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const yyyy = date.getFullYear()
  return `${mm}-${dd}-${yyyy}`
}

export function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

/** Build a Date from separate MM-DD-YYYY and HH:mm strings (local time). */
export function buildDateFromMmddyyyyAndTime(mmddyyyy, hhmm) {
  const { Y, M, D } = mmddyyyyToParts(mmddyyyy)
  const [h, m] = String(hhmm).split(':').map(Number)
  return new Date(Y, (M || 1) - 1, D || 1, h || 0, m || 0, 0, 0)
}
