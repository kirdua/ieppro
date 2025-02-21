<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])
const isVisible = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    isVisible.value = newVal
  }
)

const handleCancel = () => {
  emit('update:modelValue', false)
  emit('cancel')
}

const handleConfirm = () => {
  emit('confirm')
  emit('update:modelValue', false)
}
</script>

<template>
  <v-dialog v-model="isVisible" max-width="500" scrollable>
    <v-card style="max-height: 80vh; overflow-y: auto">
      <v-card-title class="text-primary">
        <slot name="title">Default Title</slot>
      </v-card-title>
      <v-card-text>
        <slot>Default Content</slot>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn text @click="handleCancel">Cancel</v-btn>
        <v-btn color="primary" @click="handleConfirm">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.v-card-title {
  font-weight: bold;
  font-size: 1.25rem;
}
.v-card-text {
  padding-top: 16px;
  padding-bottom: 16px;
}
</style>
