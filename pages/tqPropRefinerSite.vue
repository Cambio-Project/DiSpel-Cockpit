<script setup lang="ts">

const file = ref("chaos-exp-1-trace.csv")
const pattern = ref("Absence")

let TQPropRefinerActive = ref(false);

let src = computed(() => "/tqPropRefinerContainer/requirement-refinement/shortcut?file="+file.value+"&pattern="+pattern.value)

</script>

<template>

  <select v-model="file">
    <option value="chaos-exp-1-trace.csv" selected>chaos-exp-1-trace.csv</option>
    <option value="chaos-exp-2-trace.csv">chaos-exp-2-trace.csv</option>
    <option value="chaos-exp-3-trace.csv">chaos-exp-3-trace.csv</option>
  </select>

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