<script setup>
import { ref, onMounted } from 'vue'
import NoChild from './NoChild.vue'
import ChildCard from '@/components/children/ChildCard.vue'
import ChildDialog from '@/components/children/ChildDialog.vue'
import useUserStore from '@/stores/user'
import useChildrenStore from '@/stores/children'

const userStore = useUserStore()
const childStore = useChildrenStore()

const { userInfo } = userStore

const isLoading = ref(false)

onMounted(() => {
  if (!userInfo.uid) return
  getChildrenInfo()
})

const getChildrenInfo = async () => {
  isLoading.value = true
  try {
    await childStore.getChildrenProfiles(userInfo.uid)

    if (childStore.children) {
      isLoading.value = false
    }
  } catch (error) {
    console.error(error)
  }
  isLoading.value = false
}
</script>
<template>
  <div>
    <!-- Loading bar -->
    <v-progress-linear v-if="isLoading" color="cyan" indeterminate />

    <!-- Empty state (only after loading finishes) -->
    <v-row v-else-if="childStore.children.length === 0" class="pa-3" justify="start">
      <v-col cols="12">
        <NoChild />
      </v-col>
    </v-row>

    <!-- Children grid -->
    <v-row v-else class="pa-3" justify="start">
      <v-col
        v-for="child in childStore.children"
        :key="child.id || child._id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="3"
      >
        <ChildCard :child="child" @get-child-data="getChildrenInfo" />
      </v-col>
    </v-row>

    <!-- Add / Edit dialog trigger -->
    <v-row>
      <v-col>
        <ChildDialog
          :parentId="userInfo.uid"
          :disabled="isLoading"
          @get-child-data="getChildrenInfo"
        />
      </v-col>
    </v-row>
  </div>
</template>
