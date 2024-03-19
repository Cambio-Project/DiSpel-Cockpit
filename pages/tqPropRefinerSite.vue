<script setup lang="ts">

const simId = ref("")
const pattern = ref("Absence")

let TQPropRefinerActive = ref(false);

const config = useRuntimeConfig()

let src = computed(() => "http://"+config.public.tqPropRefinerDomain+":"+config.public.tqPropRefinerPort+"/requirement-refinement/shortcut?file-address=assets/simulations_results&sim_id="+simId.value+"&pattern="+pattern.value)

</script>

<template>

  <input v-model="simId" placeholder="enter simulation id...">

  <select v-model="pattern">
    <option value="Absence" selected>Absence</option>
  </select>

  <button v-if="!TQPropRefinerActive" @click="TQPropRefinerActive = true">Start TQPropRefiner</button>
  <button v-else @click="TQPropRefinerActive = false">Stop TQPropRefiner</button>
  <br>
  <br>

  <div v-if="TQPropRefinerActive">
    <iframe class="mainFrame"
            v-bind:src="src"
            title="SimpleTest"></iframe>
  </div>
  <br> <br>

  <div>
    <a href="/">Dashboard</a> |
    <a href="/pspwizardSite">PSPWizard</a> |
    <a href="/scenariosSite">Scenarios</a> |
    <a href="/scenarioEditorSite">Scenario Editor</a> |
    <a href="/tqPropRefinerSite">TQPropRefiner</a>
  </div>
</template>

<style scoped>
.mainFrame{
  width: 80%;
  height: 80vh;
  border: #3f51b5 3px solid;
}
</style>