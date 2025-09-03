<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import useUserStore from '@/stores/user'
import useServicesStore from '@/stores/services'
import useChildrenStore from '@/stores/children'

import NoServices from './NoServices.vue'
import ServicesTable from './ServicesTable.vue'
import AddServicesModal from './components/AddServicesModal.vue'
import ServiceSidebar from './components/ServiceSidebar.vue'
import DeleteServiceDialog from './components/DeleteServiceDialog.vue'

const userStore = useUserStore()
const childStore = useChildrenStore()
const servicesStore = useServicesStore()

const { uid } = userStore.userInfo

const isLoading = ref(false)
const showSidebar = ref(false)
const selectedService = ref(null)

const deleteDialogVisible = ref(false)
const serviceToDelete = ref(null)

/* Read current selection from AppBar (children store) */
const childId = computed(() => childStore.selectedChildProfile?.id || null)
const currentGrade = computed(() => childStore.selectedChildProfile?.gradeLevel || '')

/* Ensure children/selection exist when landing directly on this page */
onMounted(async () => {
  isLoading.value = true

  if (!childStore.children?.length && uid) {
    await childStore.getChildrenProfiles(uid)
  }

  // If nothing is selected yet, default to the first child (reuse your helper)
  if (!childStore.selectedChildProfile && childStore.children.length) {
    childStore.editChildProfile(childStore.children[0])
  }

  await getServices()
  isLoading.value = false
})

/* Fetch whenever selection changes */
watch(
  [childId, currentGrade],
  () => {
    getServices()
  },
  { immediate: false }
)

const getServices = async () => {
  if (!childId.value) return
  isLoading.value = true
  const params = { id: childId.value, gradeLevel: currentGrade.value }
  servicesStore.currentChildProfile = params
  try {
    await servicesStore.getServicesByGradeLevel(params)
  } catch (error) {
    console.error(error?.response?.data?.message || error)
  } finally {
    isLoading.value = false
  }
}

/* Row interactions */
const handleRowClick = (service) => {
  selectedService.value = service
  showSidebar.value = true
}

const handleServiceSave = async (updatedService) => {
  showSidebar.value = false
  await servicesStore.updateScheduledService(updatedService)
  getServices()
}

/* Delete flow */
const showDeleteDialog = (service) => {
  serviceToDelete.value = service
  deleteDialogVisible.value = true
}

const closeDeleteDialog = () => {
  deleteDialogVisible.value = false
  serviceToDelete.value = null
}

const deleteService = async () => {
  try {
    isLoading.value = true
    await servicesStore.deleteScheduledService(serviceToDelete.value.id)
    closeDeleteDialog()
    getServices()
  } catch (error) {
    console.error(error?.response?.data?.message || error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="pa-4">
    <!-- Selectors removed: rely on AppBar's global selection -->

    <div v-if="isLoading" class="text-center mt-4">
      <v-progress-circular indeterminate color="primary" />
      <div class="mt-2">Loading Services...</div>
    </div>

    <div v-else-if="servicesStore.currentServices.length === 0">
      <NoServices />
    </div>

    <div v-else>
      <ServicesTable
        :isLoading="isLoading"
        :items="servicesStore.currentServices"
        @row-clicked="handleRowClick"
        @delete-service="showDeleteDialog"
      />
    </div>

    <ServiceSidebar
      v-model:show="showSidebar"
      :service="selectedService"
      @save="handleServiceSave"
    />

    <!-- Still pass the current selection down -->
    <AddServicesModal
      :selectedChildId="childId"
      :currentGrade="currentGrade"
      @service-added="getServices"
    />

    <DeleteServiceDialog
      v-if="deleteDialogVisible"
      :service="serviceToDelete"
      :showDeleteDialog="deleteDialogVisible"
      @closeDeleteDialog="closeDeleteDialog"
      @confirmDelete="deleteService"
    />
  </div>
</template>
