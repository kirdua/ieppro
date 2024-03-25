<script setup>
import { ref, onMounted } from 'vue'
import AddChild from '@/components/AddChild.vue'
import useUserStore from '@/stores/user'
import useChildrenStore from '@/stores/children'

const userStore = useUserStore()
const childStore = useChildrenStore()

const { userInfo } = userStore

const isLoading = ref(false)

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

    {{ childStore.children }}
  </div>
</template>
