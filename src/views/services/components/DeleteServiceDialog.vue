<script setup>
const props = defineProps({
  service: Object,
  showDeleteDialog: Boolean
})

const emit = defineEmits(['closeDeleteDialog', 'confirmDelete'])
</script>

<template>
  <v-dialog v-model="props.showDeleteDialog" max-width="600px">
    <v-card>
      <v-card-title class="headline text-red" text-red>Delete Goal?</v-card-title>
      <v-card-text>
        Are you sure you want to delete the goal:
        <strong class="text-red">{{ props.service?.course }}</strong
        >?
        <br />

        <strong>This action cannot be undone.</strong>
      </v-card-text>
      <v-card-actions>
        <v-btn variant="outlined" @click="emit('closeDeleteDialog')">Cancel</v-btn>
        <v-btn variant="outlined" color="red" @click="emit('confirmDelete')">Delete Goal</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
