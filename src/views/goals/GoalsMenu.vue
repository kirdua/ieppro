<script setup>
const items = [
  {
    title: 'Item #1',
    value: 1
  },
  {
    title: 'Item #2',
    value: 2
  },
  {
    title: 'Item #3',
    value: 3
  }
]
</script>
<template>
  <v-card class="mx-auto" max-width="300">
    <v-list :items="items"></v-list>
  </v-card>
</template>

<style>
.bg {
  background-color: bisque;
}
</style>
