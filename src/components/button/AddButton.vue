<script setup>
const props = defineProps({
  color: {
    type: String,
    default: 'primary'
  },
  buttonText: {
    type: String,
    required: true
  },
  handleClick: {
    type: Function,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="d-flex justify-end mr-5">
    <v-btn :color="color" variant="outlined" rippel @click="handleClick" :disabled="disabled">
      {{ buttonText }}
    </v-btn>
  </div>
</template>

<style scoped>
.d-flex {
  display: flex;
}

.justify-end {
  justify-content: flex-end;
}

.mr-5 {
  margin-right: 20px; /* Adjust as needed */
}
</style>
