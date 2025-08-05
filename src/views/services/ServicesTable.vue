<script setup>
import { servicesHeaders, formatTableData } from '@/constants'

const props = defineProps(['items', 'isLoading'])
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
      </tr>
    </template>
    <template #bottom></template>
  </v-data-table>
</template>
