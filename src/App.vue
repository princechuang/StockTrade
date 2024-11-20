<script setup lang="ts">
import { useRoute } from 'vue-router';
import menuBar from '@/components/MenuBar.vue';
const route=useRoute();
</script>

<template>
  <RouterView :key="route.fullPath"></RouterView>
  <menu-bar></menu-bar>
</template>

