<script setup>
import { ref, computed } from 'vue'
import { gradeLevels, diagnosesList, accommodationsList } from '@/includes/child-options'
import { useFormRules } from '@/includes/validation'
import useChildrenStore from '@/stores/children'
import { toast } from 'vue3-toastify'

const childrenStore = useChildrenStore()

const props = defineProps(['parentId', 'disabled'])
const emit = defineEmits(['getChildData'])

const dialog = ref(false)
const name = ref('')
const dateOfBirth = ref('')
const gradeLevel = ref('')
const diagnoses = ref()
const accommodations = ref()

const { validateBirthDate } = useFormRules()

const dateOfBirthRules = computed(() => [
  (value) => validateBirthDate(value) || 'Date must be in the format M/D/YYYY'
])

const clearForm = () => {
  name.value = ''
  dateOfBirth.value = ''
  gradeLevel.value = ''
  diagnoses.value = null
  accommodations.value = null
}

const submitChild = async () => {
  const childInfo = {
    parentId: props.parentId,
    name: name.value,
    dateOfBirth: dateOfBirth.value,
    gradeLevel: gradeLevel.value,
    diagnoses: diagnoses.value,
    accommodations: accommodations.value
  }

  if (!name.value || !dateOfBirth.value || !gradeLevel.value || !diagnoses.value) {
    return toast.error('Add child information')
  }

  try {
    await childrenStore.addChild(childInfo)
    toast.success('Child added')
    dialog.value = false
    emit('getChildData')
    clearForm()
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Child registration failed')
  }
}

const cancel = () => {
  clearForm()
  dialog.value = false
}
</script>

<template>
  <div class="d-flex justify-end mr-5">
    <v-btn color="primary" rippel @click="dialog = true" :disabled="disabled">Add Child</v-btn>
    <v-dialog v-model="dialog" max-width="400" persistent>
      <v-card class="pa-4">
        <v-card-title>Child's Information</v-card-title>
        <v-text-field v-model="name" placeholder="Child's name" class="p-1"></v-text-field>
        <v-text-field
          v-model="dateOfBirth"
          :rules="dateOfBirthRules"
          placeholder="Date of birth: 1/1/2023"
        ></v-text-field>
        <v-select v-model="gradeLevel" :items="gradeLevels" label="Grade Level"></v-select>
        <v-select
          v-model="diagnoses"
          :items="diagnosesList"
          label="Diagnoses"
          chips
          multiple
        ></v-select>
        <v-select
          v-model="accommodations"
          :items="accommodationsList"
          label="Accommodations"
          chips
          multiple
        ></v-select>
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn @click="submitChild" color="primary"> Submit </v-btn>
          <v-btn @click="cancel"> Cancel </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
