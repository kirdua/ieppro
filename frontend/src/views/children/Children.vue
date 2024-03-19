<script setup>
import AddChild from '@/components/AddChild.vue'
import useUserStore from '@/stores/user'
import useChildrenStore from '@/stores/children'

const userStore = useUserStore()
const childrenStore = useChildrenStore()

const submitChildInfo = (childInfo) => {
  console.log(childInfo)
}
</script>
<template>
  <div>
    <add-child @submit-child="submitChildInfo" />
  </div>
</template>
