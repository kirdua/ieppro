<script setup>
import { goalHeaders, formatTableData } from '@/constants'

const props = defineProps({
  items: Array,
  isLoading: Boolean
})
const emit = defineEmits(['row-clicked', 'delete-goal'])

const handleRowClick = (item) => emit('row-clicked', item)
const handleDelete = (item, event) => {
  event.stopPropagation()
  emit('delete-goal', item)
}

// Optional: map goalType to a tone (tweak as you like)
const typeColor = (type) => {
  if (!type) return 'default'
  const t = String(type).toLowerCase()
  if (t.includes('reading')) return 'primary'
  if (t.includes('math')) return 'secondary'
  if (t.includes('behavior')) return 'warning'
  if (t.includes('speech')) return 'info'
  return 'default'
}
</script>

<template>
  <v-card elevation="8" rounded="xl" class="overflow-hidden">
    <!-- Color header bar -->
    <div class="table-header-bar d-flex align-center px-4 py-3">
      <div class="text-subtitle-1 font-weight-medium">Goals</div>
      <v-spacer />
      <v-progress-circular v-if="props.isLoading" indeterminate size="18" width="2" color="white" />
    </div>

    <v-divider />

    <v-data-table
      :headers="goalHeaders"
      :items="props.items"
      :loading="props.isLoading"
      class="pro-table"
      density="comfortable"
      hover
      fixed-header
      height="520"
      item-key="id"
    >
      <!-- Loading skeleton -->
      <template #loading>
        <tbody>
          <tr v-for="i in 8" :key="i">
            <td :colspan="goalHeaders.length" class="pa-0">
              <v-skeleton-loader type="table-row" />
            </td>
          </tr>
        </tbody>
      </template>

      <!-- Header cells: uppercase + subdued -->
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

      <!-- Custom row -->
      <template #item="{ item }">
        <tr class="hoverable-row" @click="handleRowClick(item)">
          <td class="td-clip">{{ item.goalFocus }}</td>
          <td>
            <v-chip
              :color="typeColor(item.goalType)"
              :variant="typeColor(item.goalType) === 'default' ? 'tonal' : 'flat'"
              size="small"
              class="font-weight-medium"
            >
              {{ item.goalType || '—' }}
            </v-chip>
          </td>
          <td class="td-clip">{{ item.currentPerformance }}</td>
          <td>{{ item.duration }}</td>
          <td>{{ formatTableData(item.benchmarks, 'number') }}</td>
          <td class="td-clip">{{ item.implementer }}</td>

          <td class="text-right">
            <v-tooltip text="Delete goal" location="top">
              <template #activator="{ props: tip }">
                <v-btn
                  v-bind="tip"
                  icon
                  size="small"
                  variant="text"
                  color="error"
                  @click="handleDelete(item, $event)"
                  aria-label="Delete goal"
                >
                  <v-icon size="20">mdi-trash-can</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </td>
        </tr>
      </template>

      <!-- Remove default footer -->
      <template #bottom />
    </v-data-table>
  </v-card>
</template>

<style scoped>
/* Color bar reflects your theme primary */
.table-header-bar {
  background: rgb(var(--v-theme-primary));
  color: white;
}

/* Sticky header look + subtle backdrop */
.pro-table :deep(thead) {
  position: sticky;
  top: 0;
  z-index: 2;
  background: linear-gradient(
    to bottom,
    color-mix(in srgb, var(--v-theme-surface) 90%, #0000 10%),
    var(--v-theme-surface)
  );
}
.th-cell {
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 12px 14px !important;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.06);
}

/* Row styling: stripes + hover */
.pro-table :deep(tbody tr:nth-child(even)) {
  background-color: rgba(var(--v-theme-primary), 0.02);
}
.hoverable-row:hover {
  background-color: rgba(var(--v-theme-primary), 0.08) !important;
  cursor: pointer;
}

/* Cell padding + clipping for long text */
.pro-table :deep(td) {
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

/* Right-align Actions header/cell */
.pro-table :deep(th:last-child),
.pro-table :deep(td:last-child) {
  width: 72px;
}

/* Elevation polish */
:deep(.v-card) {
  backdrop-filter: saturate(1.1);
}
</style>
