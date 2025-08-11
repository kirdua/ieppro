export const servicesHeaders = [
  { title: 'Semester', align: 'left', key: 'semester' },
  { title: 'Course', align: 'left', key: 'course' },
  { title: 'Gen Ed Modified', align: 'left', key: 'genEdModified' },
  { title: 'Start Date', align: 'left', key: 'startDate' },
  { title: 'End Date', align: 'left', key: 'endDate' },
  { title: 'Actions', align: 'left', key: 'actions', sortable: false }
]

export const goalHeaders = [
  {
    title: 'Goal Focus',
    align: 'left',
    key: 'goalFocus'
  },
  {
    title: 'Goal Type',
    align: 'left',
    key: 'goalType'
  },
  {
    title: 'Current Performance',
    align: 'left',
    key: 'currentPerformance'
  },
  {
    title: 'Duration',
    align: 'left',
    key: 'duration'
  },
  {
    title: 'Benchmarks',
    align: 'left',
    key: 'benchmark'
  },
  {
    title: 'Implementer',
    align: 'left',
    key: 'implementer'
  },
  {
    title: 'Actions',
    align: 'left',
    key: 'actions',
    sortable: false
  }
]

export const formatTableData = (value, type) => {
  if (type === 'falsey') return !value ? '--' : 'Yes'
  if (type === 'time') return !value ? '' : `${value} mins`
  if (type === 'number') return !value ? '' : `${value.length} benchmarks`
}

export const semesterOptions = ['Full IEP Year', 'Fall', 'Spring', 'Summer']

export const locationOptions = [
  'General Education Classroom',
  'Special Education Classroom',
  'in-class supports General Eduction Classroom',
  'w/ support General Education Classroom',
  'in-class supports Special Education Classroom',
  'w/ support Special Education Classroom'
]

export const progressGradedByOptions = ['General Education', 'Special Education', 'Joint']

export const esyServicesDiscussedOptions = ['Yes', 'No', 'Not considered at this time']

export const esyConsiderationOptions = [
  'Recommended by parent',
  `Recommended by district personnel directly involved in the student's education`,
  'Not recommended by either parent or school'
]

export const esyRecommendedOptions = ['Yes', 'No']

export const goalTypeItems = ['Academic', 'Functional', 'Related Services']

export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_PUBLIC_CLOUDINARY_CLOUD_NAME
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_PUBLIC_CLOUDINARY_UPLOAD_PRESET
export const CLOUDINARY_API_KEY = import.meta.env.EXPO_PUBLIC_CLOUDINARY_API_KEY
export const CLOUDINARY_API_SECRET = import.meta.env.EXPO_PUBLIC_CLOUDINARY_SECRET
export const CLOUDINARY_URL = `CLOUDINARY_URL=cloudinary://${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}@${CLOUDINARY_CLOUD_NAME}`
