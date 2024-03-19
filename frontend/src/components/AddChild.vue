<script setup>
import { ref, computed } from 'vue'
import { gradeLevels, diagnosesList, accommodationsList } from '@/includes/child-options'
import { useFormRules } from '@/includes/validation'

const emit = defineEmits(['submitChild'])

const dialog = ref(false)
const name = ref('')
const dateOfBirth = ref('')
const gradeLevel = ref('')
const diagnoses = ref()
const accommodations = ref()
const error = ref(false)

const { validateBirthDate } = useFormRules()

const dateOfBirthRules = computed(() => [
  (value) => validateBirthDate(value) || 'Date must be in the format M/D/YYYY'
])

const submitChild = () => {
  const childInfo = {
    name: name.value,
    dateOfBirth: dateOfBirth.value,
    gradeLevel: gradeLevel.value,
    diagnoses: diagnoses.value,
    accommodations: accommodations.value
  }

  if (!name.value || !dateOfBirth.value || !gradeLevel.value || !diagnoses.value) {
    return (error.value = true)
  }

  emit('submitChild', childInfo)
  dialog.value = false
}

const cancel = () => {
  name.value = ''
  dateOfBirth.value = ''
  gradeLevel.value = ''
  diagnoses.value = null
  accommodations.value = null
  dialog.value = false
}
</script>

<template>
  <div class="d-flex justify-end mr-5">
    <v-btn color="primary" rippel @click="dialog = true">Add Child</v-btn>
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
        <div v-if="error" class="error">Please fill out the form</div>
      </v-card>
    </v-dialog>
  </div>
</template>
<style module>
.error {
  color: 'red' !important;
}
</style>
