<script setup lang="ts">

const simID = ref("")

async function test() {

  const response = await useFetch("/api/verifySimulation", {
    method: "POST",
    body: JSON.stringify({
      simulationID: simID.value
    })
  })

  console.log(JSON.stringify(response.data.value!))

}


const dbMissing = true

</script>

<template>

  <form method="post" action="http://localhost:8084/simulate/upload" enctype="multipart/form-data" target="_blank">
    <input type="file" name="files" multiple="multiple">
    <input type="text" name="simulation_id">
    <input type="submit">
  </form>

  <input type="text" v-model="simID"></input>
  <button @click="test">ToTBVerifier</button>

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