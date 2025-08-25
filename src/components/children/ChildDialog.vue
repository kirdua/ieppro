<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import {
  gradeLevels,
  diagnosesList,
  accommodationsList,
  specialServicesList
} from '@/utils/child-options'
import { useCloudinary } from '@/composables/useCloudinary'
import { useFormRules } from '@/utils/validation'
import useChildrenStore from '@/stores/children'
import { toast } from 'vue3-toastify'
import { readableTimestamp } from '@/utils/date-format'
import { v7 as uuidv7 } from 'uuid'
import TruncatedMultiSelect from './TruncatedMultiSelect.vue'

/**
 * Util: strip all undefined recursively so Firestore never sees it
 */
function stripUndefined(obj) {
  if (obj == null || typeof obj !== 'object') return obj
  const out = Array.isArray(obj) ? [] : {}
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue
    out[k] = stripUndefined(v)
  }
  return out
}

const childrenStore = useChildrenStore()
const myuuid = uuidv7()

const { uploadToCloudinary, isUploading, uploadError } = useCloudinary()

const props = defineProps({
  parentId: { type: String, required: true },
  disabled: { type: Boolean, default: false }
})
const emit = defineEmits(['getChildData'])

/** form state */
const name = ref('')
const dateOfBirth = ref('')
const currentSchool = ref('')
const currentTeacher = ref('')
const gradeLevel = ref('')
const diagnoses = ref([])
const accommodations = ref([])
const specialServices = ref([])
const _id = ref('')

/** image handling */
const imageFile = ref([]) // v-file-input model (array of File)
const previewUrl = ref('') // blob or https for UI only
const uploadedUrl = ref(null) // REAL https URL to save to Firestore (or null)

/** validation */
const { validateBirthDate } = useFormRules()
const dateOfBirthRules = computed(() => [
  (value) => validateBirthDate(value) || 'Date must be in the format M/D/YYYY'
])

/** helpers */
function revokePreview() {
  if (previewUrl.value?.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(previewUrl.value)
    } catch {}
  }
}

const clearForm = () => {
  name.value = ''
  dateOfBirth.value = ''
  currentSchool.value = ''
  currentTeacher.value = ''
  gradeLevel.value = ''
  diagnoses.value = []
  accommodations.value = []
  specialServices.value = []
  imageFile.value = []
  revokePreview()
  previewUrl.value = ''
  uploadedUrl.value = null
  _id.value = ''
}

const populateForm = () => {
  const selectedChild = childrenStore.selectedChildProfile
  if (!selectedChild) return

  const formattedDate = readableTimestamp(selectedChild.dateOfBirth)
  name.value = selectedChild.name || ''
  dateOfBirth.value = formattedDate || ''
  currentSchool.value = selectedChild.currentSchool || ''
  currentTeacher.value = selectedChild.currentTeacher || ''
  gradeLevel.value = selectedChild.gradeLevel || ''
  diagnoses.value = selectedChild.diagnoses || []
  accommodations.value = selectedChild.accommodations || []
  specialServices.value = selectedChild.specialServices || []
  _id.value = selectedChild._id || ''

  // Existing profile image should be a persisted HTTPS url
  if (selectedChild.profileImage) {
    revokePreview()
    previewUrl.value = selectedChild.profileImage
    uploadedUrl.value = selectedChild.profileImage
  } else {
    uploadedUrl.value = null
  }
}

watch(
  () => childrenStore.editProfile,
  (isEdit) => {
    if (isEdit && childrenStore.selectedChildProfile) {
      populateForm()
    } else {
      clearForm()
    }
  },
  { immediate: true }
)

/** Handle user picking a file:
 *  - show blob preview immediately
 *  - upload to Cloudinary
 *  - store the real HTTPS url in uploadedUrl (to be saved)
 */
watch(imageFile, async (files) => {
  const file = files?.[0]
  if (!file) {
    revokePreview()
    previewUrl.value = ''
    uploadedUrl.value = null
    return
  }

  // UI preview
  revokePreview()
  previewUrl.value = URL.createObjectURL(file)

  // Upload
  try {
    const uploaded = await uploadToCloudinary(file)
    const url = uploaded?.secure_url || uploaded?.url || null
    if (!url) {
      uploadedUrl.value = null
      toast.error('Failed to upload image')
      return
    }
    uploadedUrl.value = url
  } catch (e) {
    uploadedUrl.value = null
    toast.error('Failed to upload image')
  }
})

onUnmounted(() => {
  revokePreview()
})

const submitChild = async () => {
  if (!name.value || !dateOfBirth.value || !gradeLevel.value || !diagnoses.value.length) {
    return toast.error('Add child information')
  }

  // If a file was picked and upload still running, block submit
  if (imageFile.value?.[0] && isUploading.value) {
    return toast.info('Please wait for the photo to finish uploading…')
  }

  // Never pass undefined: either a real url or null
  const imageUrlToSave = uploadedUrl.value ?? null

  const childInfo = stripUndefined({
    parentId: props.parentId,
    name: name.value,
    dateOfBirth: dateOfBirth.value,
    currentSchool: currentSchool.value,
    currentTeacher: currentTeacher.value,
    gradeLevel: gradeLevel.value,
    diagnoses: diagnoses.value,
    accommodations: accommodations.value,
    specialServices: specialServices.value,
    profileImage: imageUrlToSave, // ✅ null or https URL
    _id: _id.value || myuuid
  })

  try {
    if (childrenStore.editProfile) {
      await childrenStore.updateChildProfile(childInfo)
      toast.success('Child updated')
    } else {
      await childrenStore.addChild(childInfo)
      toast.success('Child added')
    }

    childrenStore.toggleModal()
    emit('getChildData')
    clearForm()
  } catch (error) {
    console.error(error)
    const updateAdd = childrenStore.editProfile ? 'update' : 'registration'
    toast.error(error?.response?.data?.message || `Child ${updateAdd} failed`)
  }
}

const cancel = () => {
  clearForm()
  childrenStore.selectedChildProfile = null
  childrenStore.editProfile = false
  childrenStore.toggleModal()
}
</script>

<template>
  <v-dialog v-model="childrenStore.modalIsVisible" max-width="600">
    <v-card class="pa-4">
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Child's Information</span>
        <v-btn icon variant="text" @click="cancel" class="ma-0 pa-0">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-text-field v-model="name" placeholder="Child's name" class="p-1" />
      <v-text-field
        v-model="dateOfBirth"
        :rules="dateOfBirthRules"
        placeholder="Date of birth: 1/1/2023"
      />
      <v-text-field v-model="currentSchool" placeholder="School" />
      <v-text-field v-model="currentTeacher" placeholder="Teacher" />
      <v-select v-model="gradeLevel" :items="gradeLevels" label="Grade Level" />

      <truncated-multi-select
        v-model="diagnoses"
        :items="diagnosesList"
        label="Qualifications"
        color="indigo"
      />

      <truncated-multi-select
        v-model="accommodations"
        :items="accommodationsList"
        label="Accommodations"
        color="teal"
      />

      <truncated-multi-select
        v-model="specialServices"
        :items="specialServicesList"
        label="Special Services"
        color="primary"
      />

      <v-file-input
        v-model="imageFile"
        label="Upload Child's Photo"
        accept="image/*"
        show-size
        prepend-icon="mdi-camera"
        class="mt-2"
      />

      <v-progress-linear v-if="isUploading" indeterminate color="primary" class="mb-2" />
      <v-img v-if="previewUrl" :src="previewUrl" max-height="150" contain class="mb-2" />

      <v-alert
        v-if="uploadError"
        type="error"
        title="Upload Error"
        text="There was a problem uploading the image."
        class="mb-2"
      />

      <template #actions>
        <v-spacer />
        <v-btn @click="cancel">Cancel</v-btn>
        <v-btn :disabled="isUploading" @click="submitChild" color="primary">Submit</v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
