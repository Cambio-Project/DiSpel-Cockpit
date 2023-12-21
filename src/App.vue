<script setup>
import { ref, computed } from 'vue'
import Dashboard from '@/components/Dashboard.vue'
import Scenarios from "@/components/Scenarios.vue";

const routes = {
  '/': Dashboard,
  '/scenarios': Scenarios
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/']
})

</script>

<template>
  <component :is="currentView" />
  <a href="#/">Dashboard</a> |
  <a href="#/scenarios">Scenarios</a>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>


