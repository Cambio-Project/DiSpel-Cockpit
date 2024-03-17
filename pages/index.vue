<script setup lang="ts">
//TODO Add DB Ping
const dbMissing = true

</script>

<template>
  <h1 class="text-3xl">Dashboard Landing Page</h1>

  <div v-if="dbMissing" class="dbMissingWarning">
    <h2>DB is not connected</h2>
  </div>

  <div>
    <a href="/pspwizardSite">PSPWizard</a> |
    <a href="/scenariosSite">Scenarios</a> |
    <a href="/scenarioEditorSite">Scenario Editor</a> |
    <a href="/tqPropRefinerSite">TQPropRefiner</a>
  </div>
</template>

<style>
.dbMissingWarning{
  background-color: red;
  color: white;
}
</style>