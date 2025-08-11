<script setup>
import { servicesHeaders, formatTableData } from '@/constants'

const props = defineProps(['items', 'isLoading'])
const emit = defineEmits(['row-clicked', 'delete-service'])

const handleDelete = (item, event) => {
  event.stopPropagation() // Prevent triggering row click
  emit('delete-service', item)
}

const handleRowClick = (item) => {
  emit('row-clicked', item)
}
</script>
<template>
  <v-data-table :headers="servicesHeaders" :items="props.items" :loading="isLoading">
    <template v-slot:item="{ item }">
      <tr class="hoverable-row" @click="handleRowClick(item)">
        <td>{{ item.semester }}</td>
        <td>{{ item.course }}</td>
        <td>{{ formatTableData(item.genEdModified, 'falsey') }}</td>
        <td>{{ item.startDate }}</td>
        <td>{{ item.endDate }}</td>
        <td>
          <v-icon color="red" class="cursor-pointer" size="20" @click="handleDelete(item, $event)">
            mdi-trash-can
          </v-icon>
        </td>
      </tr>
    </template>
    <template #bottom></template>
  </v-data-table>
</template>
