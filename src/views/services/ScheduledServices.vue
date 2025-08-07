<script setup>
import { onMounted, ref, watch } from 'vue'
import useUserStore from '@/stores/user'
import useServicesStore from '@/stores/services'
import useChildrenStore from '@/stores/children'
import { gradeLevels } from '@/utils/child-options'

import NoServices from './NoServices.vue'
import ServicesTable from './ServicesTable.vue'
import AddServicesModal from './components/AddServicesModal.vue'

const userStore = useUserStore()
const childStore = useChildrenStore()
const servicesStore = useServicesStore()

const { uid } = userStore.userInfo

const currentGrade = ref('')
const selectedChildId = ref(null)
const childOptions = ref([])
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  await childStore.getChildrenProfiles(uid)
  if (childStore.children.length > 0) {
    childOptions.value = childStore.children.map((child) => ({
      name: child.name,
      id: child.id,
      gradeLevel: child.gradeLevel
    }))
    selectedChildId.value = childOptions.value[0].id
    currentGrade.value = childOptions.value[0].gradeLevel
  }
  await getServices()
  isLoading.value = false
})

watch(
  () => childStore.childNameGrade,
  (newValue) => {
    if (newValue) {
      childOptions.value = newValue.map((child) => ({
        name: child.name,
        id: child._id,
        gradeLevel: child.gradeLevel
      }))
      if (childOptions.value.length > 0) {
        selectedChildId.value = childOptions.value[0]._id
        currentGrade.value = childOptions.value[0].gradeLevel
      }
    }
  },
  { immediate: true }
)

watch(
  () => [selectedChildId.value, currentGrade.value],
  () => {
    getServices()
  }
)

const getServices = async () => {
  isLoading.value = true
  const params = {
    id: selectedChildId.value,
    gradeLevel: currentGrade.value
  }
  servicesStore.currentChildProfile = params
  try {
    await servicesStore.getServicesByGradeLevel(params)
  } catch (error) {
    console.error(error?.response?.data?.message)
  }
  isLoading.value = false
}

const showDeleteDialog = (service) => {
  console.log('Show delete dialog for service:', service)
  // servicesStore.deleteDialogVisible = true
  // servicesStore.serviceToDelete = service
}
</script>
<template>
  <div class="pa-4">
    <div class="d-flex w-100 flex-inline">
      <v-select
        label="Child"
        v-model="selectedChildId"
        :items="childOptions"
        item-value="id"
        item-title="name"
        variant="outlined"
        class="w-35 mr-5"
        :disabled="isLoading"
      ></v-select>
      <v-select
        label="Grade Level"
        v-model="currentGrade"
        :items="gradeLevels"
        variant="outlined"
        class="w-35"
        :disabled="isLoading"
      ></v-select>
    </div>

    <div v-if="servicesStore.currentServices.length === 0 && !isLoading">
      <NoServices />
    </div>
    <div v-else>
      <ServicesTable
        :isLoading="isLoading"
        :items="servicesStore.currentServices"
        @delete-service="showDeleteDialog"
      />
    </div>

    <AddServicesModal
      :selectedChildId="selectedChildId"
      :currentGrade="currentGrade"
      @service-added="getServices"
    />
  </div>
</template>
