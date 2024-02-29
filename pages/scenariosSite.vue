<script setup lang="ts">
import Scenarios from "../components/Scenarios.vue";
</script>

<template>
  <client-only>
    <Scenarios></Scenarios>
  </client-only>
  <div>
    <a href="/pspwizardSite">PSPWizard</a> |
    <a href="/scenariosSite">Scenarios</a> |
    <a href="/scenarioEditorSite">Scenario Editor</a>
  </div>
</template>
