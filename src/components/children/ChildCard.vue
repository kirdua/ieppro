<script setup>
import { computed } from 'vue'
import { readableTimestamp } from '@/utils/date-format'
import useChildrenStore from '@/stores/children'
import { toast } from 'vue3-toastify'
import { useRouter } from 'vue-router'

const props = defineProps(['child'])
const emit = defineEmits(['getChildData'])

const router = useRouter()
const childrenStore = useChildrenStore()

const birthDate = computed(() => {
  return readableTimestamp(props.child.dateOfBirth)
})

const updateChildInfo = async () => {
  childrenStore.toggleModal()
  childrenStore.editChildProfile(props.child)
}

const deleteChildInfo = async () => {
  const { _id, parentId } = props.child
  try {
    childrenStore.deleteChildProfile({ _id, parentId })
    toast.success('Child removed')
    emit('getChildData')
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Delete child failed')
  }
}

const goToAddServices = (id, grade) => {
  router.push({ name: 'add-services', query: { id, grade } })
}
</script>

<template>
  <v-card
    elevation="8"
    class="pa-0"
    color="white"
    style="border-radius: 12px; max-width: 500px; width: 500px"
  >
    <!-- Header with background -->
    <v-sheet
      color="#385F73"
      class="d-flex justify-space-between align-start pa-4"
      elevation="0"
      rounded="t"
    >
      <!-- Avatar + Name -->
      <div class="d-flex align-start">
        <v-avatar size="64" class="mr-4">
          <v-img
            v-if="props.child.profileImage"
            :src="props.child.profileImage"
            alt="Child photo"
            cover
          />
          <v-icon v-else size="32" color="grey">mdi-account</v-icon>
        </v-avatar>
        <div>
          <div class="text-h6 font-weight-bold text-white">{{ props.child.name }}</div>
          <div class="text-h7 text-white">
            <span class="font-weight-bold">DOB:</span> {{ birthDate }}<br />
            <span class="font-weight-bold">Grade:</span> {{ props.child.gradeLevel }}
          </div>
        </div>
      </div>

      <!-- Delete Icon with Tooltip -->
      <v-tooltip text="Delete Profile" location="top">
        <template #activator="{ props: tooltip }">
          <v-btn icon v-bind="tooltip" variant="text" size="small" @click="deleteChildInfo">
            <v-icon color="text-white">mdi-close</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </v-sheet>

    <!-- Content -->
    <div class="pa-5 pt-4">
      <v-divider class="mb-4" />

      <v-row no-gutters class="text-body-2 mb-2">
        <v-col cols="12" md="6" class="mb-2">
          <strong>School:</strong> {{ props.child.currentSchool || 'N/A' }}
        </v-col>
        <v-col cols="12" md="6" class="mb-2">
          <strong>Teacher:</strong> {{ props.child.currentTeacher || 'N/A' }}
        </v-col>
      </v-row>

      <div class="mb-2">
        <strong>Diagnoses:</strong>
        <div v-if="props.child.diagnoses?.length">
          <v-chip
            v-for="d in props.child.diagnoses"
            :key="d"
            class="ma-1"
            size="small"
            variant="tonal"
            color="indigo"
          >
            {{ d }}
          </v-chip>
        </div>
        <div v-else>N/A</div>
      </div>

      <div class="mb-4">
        <strong>Accommodations:</strong>
        <div v-if="props.child.accommodations?.length">
          <v-chip
            v-for="a in props.child.accommodations"
            :key="a"
            class="ma-1"
            size="small"
            variant="tonal"
            color="teal"
          >
            {{ a }}
          </v-chip>
        </div>
        <div v-else>N/A</div>
      </div>
      <div class="mb-4">
        <strong>Special Services:</strong>
        <div v-if="props.child.specialServices?.length">
          <v-chip
            v-for="a in props.child.specialServices"
            :key="a"
            class="ma-1"
            size="small"
            variant="tonal"
            color="primary"
          >
            {{ a }}
          </v-chip>
        </div>
        <div v-else>N/A</div>
      </div>

      <!-- Action Buttons -->
      <div class="d-flex justify-end mt-2">
        <v-btn variant="outlined" color="primary" size="small" @click="updateChildInfo">
          Edit Profile
        </v-btn>
        <v-btn
          variant="outlined"
          color="primary"
          size="small"
          class="ml-2"
          @click="goToAddServices(props.child._id, props.child.gradeLevel)"
        >
          Add Scheduled Services
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.text-grey-darken-4 {
  color: #ffffff;
}
.text-grey-darken-1 {
  color: #ffffff;
}
</style>
