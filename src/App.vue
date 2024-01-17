<script setup>

import { ref, computed } from 'vue';
import Dashboard from '@/components/Dashboard.vue';
import PSPWizard from "@/components/PSPWizard.vue";
import Scenarios from "@/components/Scenarios.vue";
import ScenarioEditor from "@/components/ScenarioEditor.vue";

const routes = {
  '/dashboard': Dashboard,
  '/pspwizard': PSPWizard,
  '/scenarios': Scenarios,
  '/scenarioeditor': ScenarioEditor
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
<div>
  <router-view></router-view>
  <a href="/dashboard">Dashboard</a> |
  <a href="/pspwizard">PSPWizard</a> |
  <a href="/scenarios">Scenarios</a> |
  <a href="/scenarioeditor">ScenarioEditor</a>
  </div>
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
