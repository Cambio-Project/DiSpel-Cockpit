<script setup lang="ts">

import {html} from "ultrahtml";
</script>

<template>
  <iframe class="mainFrame"
          src="http://localhost:4200/requirement-refinement/shortcut"
          title="SimpleTest"></iframe>
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