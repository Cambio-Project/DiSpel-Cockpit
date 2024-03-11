<script setup lang="ts">

const response = await useFetch("/api/verifySimulation", {
  method: "POST",
  //body: payload
})
</script>

<template>

  <div>
    <a href="/pspwizardSite">PSPWizard</a> |
    <a href="/scenariosSite">Scenarios</a> |
    <a href="/scenarioEditorSite">Scenario Editor</a> |
    <a href="/tqPropRefinerSite">TQPropRefiner</a>
  </div>
</template>