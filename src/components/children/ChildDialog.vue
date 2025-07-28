<script setup>
import { ref, computed, watch } from 'vue'
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

const childrenStore = useChildrenStore()
const myuuid = uuidv7()

const { uploadToCloudinary, isUploading, uploadError } = useCloudinary()

const props = defineProps(['parentId', 'disabled'])
const emit = defineEmits(['getChildData'])

const name = ref('')
const dateOfBirth = ref('')
const currentSchool = ref('')
const currentTeacher = ref('')
const gradeLevel = ref('')
const diagnoses = ref()
const accommodations = ref()
const specialServices = ref()
const _id = ref()
const imageFile = ref([])
const previewUrl = ref('')

const { validateBirthDate } = useFormRules()

const dateOfBirthRules = computed(() => [
  (value) => validateBirthDate(value) || 'Date must be in the format M/D/YYYY'
])

const populateForm = () => {
  const selectedChild = childrenStore.selectedChildProfile
  const formattedDate = readableTimestamp(selectedChild.dateOfBirth)
  if (selectedChild) {
    name.value = selectedChild.name
    dateOfBirth.value = formattedDate
    currentSchool.value = selectedChild.currentSchool || ''
    currentTeacher.value = selectedChild.currentTeacher || ''
    gradeLevel.value = selectedChild.gradeLevel
    diagnoses.value = selectedChild.diagnoses
    accommodations.value = selectedChild.accommodations
    specialServices.value = selectedChild.specialServices
    _id.value = selectedChild._id

    if (selectedChild.profileImage) {
      previewUrl.value = selectedChild.profileImage
    }
  }
}

const clearForm = () => {
  name.value = ''
  dateOfBirth.value = ''
  currentSchool.value = ''
  currentTeacher.value = ''
  gradeLevel.value = ''
  diagnoses.value = null
  accommodations.value = accommodationsList[0]
  specialServices.value = null
  imageFile.value = []
  previewUrl.value = ''
  _id.value = ''
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

watch(imageFile, (files) => {
  if (files?.[0]) {
    previewUrl.value = URL.createObjectURL(files[0])
  }
})

const submitChild = async () => {
  const accommodationsValue = accommodations.value || accommodationsList[0]
  const specialServicesValue = specialServices.value || []

  if (!name.value || !dateOfBirth.value || !gradeLevel.value || !diagnoses.value) {
    return toast.error('Add child information')
  }

  let uploadedImage = previewUrl.value

  if (imageFile.value?.[0]) {
    uploadedImage = await uploadToCloudinary(imageFile.value[0])
    if (!uploadedImage) {
      return toast.error('Failed to upload image')
    }
  }

  const childInfo = {
    parentId: props.parentId,
    name: name.value,
    dateOfBirth: dateOfBirth.value,
    currentSchool: currentSchool.value,
    currentTeacher: currentTeacher.value,
    gradeLevel: gradeLevel.value,
    diagnoses: diagnoses.value,
    accommodations: accommodationsValue,
    specialServices: specialServicesValue,
    profileImage: uploadedImage || undefined,
    _id: _id.value || myuuid
  }

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
    const updateAdd = childrenStore.editProfile ? 'update' : 'registration'
    toast.error(error?.response?.data?.message || `Child ${updateAdd} failed`)
  }

  childrenStore.error = 'There is an error!'
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

      <v-select v-model="diagnoses" :items="diagnosesList" label="Qualifications" chips multiple />

      <v-select
        v-model="accommodations"
        :items="accommodationsList"
        label="Accommodations"
        chips
        multiple
      />

      <v-select
        v-model="specialServices"
        :items="specialServicesList"
        label="Special Services"
        chips
        multiple
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

      <template v-slot:actions>
        <v-spacer />
        <v-btn @click="cancel">Cancel</v-btn>
        <v-btn @click="submitChild" color="primary">Submit</v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
