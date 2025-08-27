<script setup>
import { goalHeaders, formatTableData } from '@/constants'

const props = defineProps({
  items: Array,
  isLoading: Boolean
})
const emit = defineEmits(['row-clicked', 'delete-goal'])

const handleRowClick = (item) => {
  emit('row-clicked', item)
}

const handleDelete = (item, event) => {
  event.stopPropagation() // Prevent triggering row click
  emit('delete-goal', item)
}
</script>

<template>
  <v-data-table :headers="goalHeaders" :items="props.items" :loading="props.isLoading">
    <template #loading>
      <v-skeleton-loader type="table-row@10" />
    </template>

    <template #item="{ item }">
      <tr class="hoverable-row" @click="handleRowClick(item)">
        <td>{{ item.goalFocus }}</td>
        <td>{{ item.goalType }}</td>
        <td>{{ item.currentPerformance }}</td>
        <td>{{ item.duration }}</td>
        <td>{{ formatTableData(item.benchmarks, 'number') }}</td>
        <td>{{ item.implementer }}</td>
        <td>
          <v-icon color="red" class="cursor-pointer" size="20" @click="handleDelete(item, $event)">
            mdi-trash-can
          </v-icon>
        </td>
      </tr>
    </template>

    <template #bottom />
  </v-data-table>
</template>

<style scoped>
.hoverable-row:hover {
  cursor: pointer;
  background-color: #f2f0ef;
}
</style>
