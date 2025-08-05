<script setup>
import academicServices from '@/assets/academic-services.png' // ✅ valid variable name
</script>

<template>
  <div class="no-services text-center">
    <img :src="academicServices" alt="No Services Available" width="150" />
    <h2>No Services Available</h2>
    <p>
      There are currently no services scheduled. Please use the "Add Scheduled Services" button to
      add them.
    </p>
  </div>
</template>
