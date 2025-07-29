<script setup>
const props = defineProps({
  modelValue: Array,
  items: Array,
  label: String,
  color: { type: String, default: 'primary' }
})

const emit = defineEmits(['update:modelValue'])

const updateValue = (val) => {
  emit('update:modelValue', val)
}
</script>

<template>
  <v-select
    :items="items"
    :label="label"
    item-title="title"
    item-value="value"
    :model-value="modelValue"
    @update:modelValue="updateValue"
    multiple
    return-object
  >
    <!-- Custom selection chips -->
    <template #selection="{ index, item }">
      <v-chip v-if="index === 0" size="small" :color="color" class="ma-1" label>
        {{ item.title }}
      </v-chip>
      <v-chip v-else-if="index === 1" size="small" :color="color" class="ma-1" label>
        +{{ modelValue.length - 1 }} more
      </v-chip>
    </template>
  </v-select>
</template>
