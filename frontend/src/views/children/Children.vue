<script setup>
import { ref, onMounted } from 'vue'
import AddChild from '@/components/AddChild.vue'
import { gradeLevels, diagnosesList, accommodationsList } from '@/includes/child-options'
import useUserStore from '@/stores/user'
import useChildrenStore from '@/stores/children'

const userStore = useUserStore()
const childStore = useChildrenStore()

const { userInfo } = userStore

const isLoading = ref(false)
const disabled = ref(true)

onMounted(() => {
  isLoading.value = true
  if (!userInfo._id) return
  getChildrenInfo()
})

const getChildrenInfo = async () => {
  try {
    await childStore.getChildrenProfiles()

    if (childStore.children) {
      isLoading.value = false
    }
  } catch (error) {
    console.log(error)
  }
}
</script>
<template>
  <div>
    <add-child :parentId="userInfo._id" @get-child-data="getChildrenInfo" :disabled="isLoading" />
    <v-progress-linear v-if="isLoading" color="cyan" indeterminate></v-progress-linear>

    <v-row class="mt-2">
      <v-col v-for="child in childStore.children" :key="child._id" cols="12" lg="3" md="3" sm="12">
        <v-card max-width="400" prepend-icon="mdi-account" :title="child.name">
          <v-card-text class="pa-2">
            <div><strong>Date of Birth:</strong> {{ child.dateOfBirth }}</div>
            <div><strong>Grade Level:</strong> {{ child.gradeLevel }}</div>
            <div>
              <strong>Diagnoses: </strong>
              <span v-for="diagnosis in child.diagnoses" :key="diagnosis"> {{ diagnosis }}</span>
            </div>
            <div>
              <strong>Accommodations: </strong>
              <span v-for="accommodation in child.accommodations" :key="accommodation">
                {{ accommodation }}
              </span>
            </div>
          </v-card-text>
          <v-card-actions>
            <div class="d-flex align-end">
              <v-btn color="primary" variant="outlined">Edit</v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
