<script setup>
import { ref, onMounted } from 'vue'
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
    <v-progress-linear v-if="isLoading" color="cyan" indeterminate></v-progress-linear>

    <v-row class="pa-3" justify="start">
      <v-col
        v-for="child in childStore.children"
        :key="child._id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="3"
      >
        <child-card :child="child" @get-child-data="getChildrenInfo" />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <child-dialog
          :parentId="userInfo.uid"
          @get-child-data="getChildrenInfo"
          :disabled="isLoading"
        />
      </v-col>
    </v-row>
  </div>
</template>
