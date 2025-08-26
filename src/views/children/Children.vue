<script setup>
import { ref, onMounted } from 'vue'
import NoChild from './NoChild.vue'
import ChildCard from '@/components/children/ChildCard.vue'
import ChildDialog from '@/components/children/ChildDialog.vue'
import useUserStore from '@/stores/user'
import useChildrenStore from '@/stores/children'

const userStore = useUserStore()
const childStore = useChildrenStore()
const { userInfo } = userStore

const isLoading = ref(false)

onMounted(() => {
  if (!userInfo?.uid) return
  getChildrenInfo()
})

const getChildrenInfo = async () => {
  isLoading.value = true
  try {
    await childStore.getChildrenProfiles(userInfo.uid)
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="children-wrap">
    <!-- Loading -->
    <v-progress-linear v-if="isLoading" color="cyan" indeterminate />

    <!-- Empty state -->
    <div v-else-if="childStore.children.length === 0" class="pad">
      <NoChild />
    </div>

    <!-- Children grid -->
    <div v-else class="cards-grid pad">
      <div v-for="child in childStore.children" :key="child.id || child._id" class="card-cell">
        <ChildCard :child="child" @get-child-data="getChildrenInfo" />
      </div>
    </div>

    <!-- Add / Edit dialog -->
    <div class="pad">
      <ChildDialog
        :parentId="userInfo.uid"
        :disabled="isLoading"
        @get-child-data="getChildrenInfo"
      />
    </div>
  </div>
</template>

<style scoped>
/* tweak this one value to match your actual card width */
.children-wrap {
  --card-min: 520px; /* was 320; set to whatever your card actually needs */
}

.pad {
  padding: 12px;
}

/* Responsive, left-aligned grid with adaptive column count */
.cards-grid {
  display: grid;
  gap: 16px;

  /* Each column is at least --card-min wide, otherwise it grows evenly. 
     This keeps a single card pinned left and multiple cards side-by-side. */
  grid-template-columns: repeat(auto-fit, minmax(var(--card-min), 1fr));

  align-items: stretch;
  justify-items: stretch;
}

/* Prevent any child from forcing its track wider */
.card-cell {
  min-width: 0;
}

/* Ensure the Vuetify card respects its cell; no bleed/overlap */
.card-cell :deep(.v-card) {
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box;
  margin: 0 !important;
  position: static !important;
  transform: none !important;
}

/* Let long text/chips wrap inside cards */
.card-cell :deep(*) {
  min-width: 0;
  word-break: break-word;
  overflow-wrap: anywhere;
}

/* Optional: scale down min width on smaller screens */
@media (max-width: 1200px) {
  .children-wrap {
    --card-min: 460px;
  }
}
@media (max-width: 992px) {
  .children-wrap {
    --card-min: 420px;
  }
}
@media (max-width: 768px) {
  .children-wrap {
    --card-min: 360px;
  }
}
@media (max-width: 600px) {
  .children-wrap {
    --card-min: 300px;
  } /* single column on phones */
}
</style>
