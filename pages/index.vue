<script setup lang="ts">

const response = await useFetch("/api/dbPing", {
  method: "POST",
})

const dbMissing = response.data.value["offline"];

</script>

<template>

  <form method="post" action="http://localhost:8099/simulate/upload" enctype="multipart/form-data">
    <input type="file" name="files" multiple="multiple">
    <input type="text" name="simulation_id">
    <input type="submit">
  </form>

  <h1>Dashboard Landing Page</h1>

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