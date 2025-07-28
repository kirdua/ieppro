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
  console.log(props.child)
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
    width="420"
    elevation="10"
    class="pa-4 d-flex flex-column position-relative"
    color="#385F73"
  >
    <!-- Close Icon -->
    <v-btn
      icon
      class="ma-0 pa-0 position-absolute"
      style="top: 8px; right: 8px; z-index: 1"
      variant="text"
      @click="deleteChildInfo"
    >
      <v-icon color="white">mdi-close</v-icon>
    </v-btn>

    <!-- Profile Info Row -->
    <div class="d-flex align-center mb-4">
      <v-avatar size="64" class="mr-4">
        <v-img
          v-if="props.child.profileImage"
          :src="props.child.profileImage"
          alt="Child's photo"
          cover
        />
        <v-icon v-else color="white" size="32">mdi-account</v-icon>
      </v-avatar>
      <div class="text-white">
        <div class="text-h6 font-weight-medium">{{ props.child.name }}</div>
        <div class="text-body-2">Date of Birth: {{ birthDate }}</div>
        <div class="text-body-2">Grade: {{ props.child.gradeLevel }}</div>
      </div>
    </div>

    <!-- Actions -->
    <v-card-actions class="d-flex justify-end">
      <v-btn color="white" variant="outlined" size="small" @click="updateChildInfo">
        View/Edit Profile
      </v-btn>
      <v-btn
        color="white"
        variant="outlined"
        size="small"
        class="ml-2"
        @click="goToAddServices(props.child._id, props.child.gradeLevel)"
      >
        Add Special Services
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style>
.card-bg {
  background-color: '#152A38' !important;
}
</style>
