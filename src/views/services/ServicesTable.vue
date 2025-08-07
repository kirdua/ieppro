<script setup>
import { servicesHeaders, formatTableData } from '@/constants'

const props = defineProps(['items', 'isLoading'])
const emit = defineEmits(['row-clicked', 'delete-service'])

const handleDelete = (item, event) => {
  event.stopPropagation() // Prevent triggering row click
  emit('delete-service', item)
}
</script>
<template>
  <v-data-table :headers="servicesHeaders" :items="props.items" :loading="isLoading">
    <template v-slot:loading>
      <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
    </template>
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.semester }}</td>
        <td>{{ item.year }}</td>
        <td>{{ item.course }}</td>
        <td>{{ item.location }}</td>
        <td class="text-center">{{ formatTableData(item.genEdModified, 'falsey') }}</td>
        <td class="text-center">{{ formatTableData(item.genEducationTime, 'time') }}</td>
        <td class="text-center">{{ formatTableData(item.specialEducationTime, 'time') }}</td>
        <td>{{ item.gradedBy }}</td>
        <td class="text-center">{{ item.startDate }}</td>
        <td class="text-center">{{ item.endDate }}</td>
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
