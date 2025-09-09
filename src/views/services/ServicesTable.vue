<script setup>
import { servicesHeaders, formatTableData } from '@/constants'

const props = defineProps({
  items: Array,
  isLoading: Boolean
})
const emit = defineEmits(['row-clicked', 'delete-service'])

const handleRowClick = (item) => emit('row-clicked', item)
const handleDelete = (item, event) => {
  event.stopPropagation()
  emit('delete-service', item)
}

// Optional: quick color helpers
const semesterTone = (sem) => {
  if (!sem) return 'default'
  const s = String(sem).toLowerCase()
  if (s.includes('fall')) return 'primary'
  if (s.includes('spring')) return 'secondary'
  if (s.includes('summer')) return 'warning'
  return 'default'
}
</script>

<template>
  <v-card elevation="8" rounded="xl" class="overflow-hidden">
    <!-- Title bar -->
    <div class="table-header d-flex align-center px-4 py-3">
      <div class="text-subtitle-1 font-weight-medium">Schedule of Services</div>
      <v-spacer />
      <v-progress-circular v-if="props.isLoading" indeterminate size="18" width="2" color="white" />
    </div>

    <v-divider />

    <v-data-table
      :headers="servicesHeaders"
      :items="props.items"
      :loading="props.isLoading"
      class="svc-table"
      density="comfortable"
      hover
      fixed-header
      height="520"
      item-key="id"
      :items-per-page="10"
      :items-per-page-options="[5, 10, 15, 25, 50]"
    >
      <!-- Skeleton while loading -->
      <template #loading>
        <tbody>
          <tr v-for="i in 8" :key="i">
            <td :colspan="servicesHeaders.length + 1" class="pa-0">
              <v-skeleton-loader type="table-row" />
            </td>
          </tr>
        </tbody>
      </template>

      <!-- Custom header: add Actions column -->
      <template #header="{ columns }">
        <thead>
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              class="text-caption text-medium-emphasis font-weight-medium th-cell"
            >
              {{ col.title }}
            </th>
            <th class="text-caption text-medium-emphasis font-weight-medium th-cell text-right">
              Actions
            </th>
          </tr>
        </thead>
      </template>

      <!-- Rows -->
      <template #item="{ item }">
        <tr class="hoverable-row" @click="handleRowClick(item)">
          <td>
            <v-chip
              :color="semesterTone(item.semester)"
              :variant="semesterTone(item.semester) === 'default' ? 'tonal' : 'flat'"
              size="small"
              class="font-weight-medium"
            >
              {{ item.semester || '—' }}
            </v-chip>
          </td>

          <td class="td-clip">
            <v-icon size="16" class="mr-1">mdi-book-outline</v-icon>
            {{ item.course }}
          </td>

          <td>
            <v-chip
              :color="item.genEdModified ? 'success' : 'error'"
              variant="flat"
              size="x-small"
              class="font-weight-medium"
              label
            >
              {{ formatTableData(item.genEdModified, 'falsey') }}
            </v-chip>
          </td>

          <td class="td-clip">
            <v-icon size="16" class="mr-1">mdi-calendar-start</v-icon>
            {{ item.startDate }}
          </td>

          <td class="td-clip">
            <v-icon size="16" class="mr-1">mdi-calendar-end</v-icon>
            {{ item.endDate }}
          </td>

          <td class="text-right">
            <v-tooltip text="Delete service" location="top">
              <template #activator="{ props: tip }">
                <v-btn
                  v-bind="tip"
                  icon
                  size="small"
                  variant="text"
                  color="error"
                  @click="handleDelete(item, $event)"
                  aria-label="Delete service"
                >
                  <v-icon size="20">mdi-trash-can</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </td>
        </tr>
      </template>

      <!-- Use Vuetify's default footer & pagination (no custom bottom slot) -->
    </v-data-table>
  </v-card>
</template>

<style scoped>
/* Themed header bar */
.table-header {
  background: rgb(var(--v-theme-primary));
  color: white;
}

/* Sticky header look with subtle surface tint */
.svc-table :deep(thead) {
  position: sticky;
  top: 0;
  z-index: 2;
  background: linear-gradient(
    to bottom,
    color-mix(in srgb, rgb(var(--v-theme-surface)) 95%, transparent 5%),
    rgb(var(--v-theme-surface))
  );
}
.th-cell {
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 12px 14px !important;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.06);
}

/* Row striping + hover keyed to theme */
.svc-table :deep(tbody tr:nth-child(even)) {
  background-color: rgba(var(--v-theme-primary), 0.02);
}
.hoverable-row:hover {
  background-color: rgba(var(--v-theme-primary), 0.08) !important;
  cursor: pointer;
}

/* Cell polish */
.svc-table :deep(td) {
  padding: 12px 14px !important;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.06);
  vertical-align: middle;
}
.td-clip {
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Keep action column compact */
.svc-table :deep(th:last-child),
.svc-table :deep(td:last-child) {
  width: 72px;
}
</style>
