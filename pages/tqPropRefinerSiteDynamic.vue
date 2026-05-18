<script setup lang="ts">

import Navbar from "~/components/Navbar.vue";

const simulationDirectoryName = "simulations_results"
const searchDirectoryName = "search_results"

const config = useRuntimeConfig()
const route = useRoute();

const simId = route.query.sim_id;
const isSimulation = route.query.isSimulation;
const file = route.query.file;

let srcDirectory: string
let fileName: string
if (isSimulation === "true") {
  srcDirectory = simulationDirectoryName + "/" + simId + "/" + file
  fileName = "_combined.csv"
} else {
  srcDirectory = searchDirectoryName + "/" + simId
  fileName = file!.toString()
}

const res = await fetch("/api/getScenario", {
  method: "POST",
  body: JSON.stringify({
    simulationID: simId
  })
})
const body = await res.json()
const scenario = body.Scenario;

const responseIndex = Number.parseInt(route.query.response_index as any);

const response = scenario.responses[responseIndex];
const sel = response.SEL;
let tbvTimed = determineFormula(response);
let predicates = response.predicates_info;

const endMode = determineEndMode(response);
                
if (endMode) {
  tbvTimed = modifySpecificationWithEndMode(tbvTimed);
  predicates = modifyPredicatesWithEndMode(predicates);
}
predicates = JSON.stringify(predicates);                

const src = computed(() => "http://" + config.public.tqPropRefinerDomain + ":" + config.public.tqPropRefinerPort + "/requirement-refinement/dynamic?file-address=assets/" + srcDirectory + "&file=" + fileName + "&sim_id=" + simId + "&response_index=" + responseIndex + "&future_mtl=true" + "&sel=" + sel + "&tbv_timed=" + tbvTimed + "&predicates=" + predicates+ "&end_mode=" + endMode);

function modifySpecificationWithEndMode(specification: string): string {
    return specification.replaceAll("$END", "(END(end))");
}

function modifyPredicatesWithEndMode(predicates: any[]): any[] {
    const endModePredicate = {
        predicate_name: 'END',
        predicate_logic: 'equal',
        measurement_source: 'end',
        predicate_comparison_value: '1'
    }
    return [...predicates, endModePredicate];
}

function determineFormula(response: any): string{
    if(response.specification.selectedTimeBound == null){
        return response.TBV_untimed
    }else{
        return response.TBV_timed
    }
}

function determineEndMode(response: any): boolean{
    if(response.specification.selectedTimeBound == null){
        return response.TBV_untimed_requires_end_mode
    }
    else{
        return response.TBV_timed_requires_end_mode
    }
}

</script>

<template>
  <Navbar title="Scenario Refinement"></Navbar>
  <!-- TODO add button style -->
  <br>

  <div class="flex justify-center">
    <iframe class="mainFrame"
            v-bind:src="src"
            title="SimpleTest"></iframe>
  </div>
  <br>

  <NuxtLink :to="'/scenarioDetails/?simID=' + route.query.sim_id">
    <UButton>Back to Scenarios</UButton>
  </NuxtLink>
</template>

<style scoped>
.mainFrame {
  width: 80%;
  height: 80vh;
  border: #3f51b5 3px solid;
}
</style>