<script setup lang="ts">

const config = useRuntimeConfig()

// TODO replace hard coded parameters with parameters from scenario
const simId = '69';
const scenarioId = '678';
const responseIndex = 0;
const sel = 'Globally, if {EventA(SimulationTime)} [has occurred] then in response {EventB(AllResponseTimes)} [eventually holds].';
const tbvTimed = 'always(((EventA(SimulationTime) and (EventA(SimulationTime)) ) since[0,30] EventB(AllResponseTimes)))';
const predicates = JSON.stringify([
	{
		measurement_source: 'SimulationTime',
		predicate_comparison_value: 100,
		predicate_logic: "bigger",
		predicate_name: 'EventA',
	},
	{
		measurement_source: 'AllResponseTimes',
		predicate_comparison_value: 0.01,
		predicate_logic: "bigger",
		predicate_name: 'EventB',
	}
]);

// TODO change Base URL to config
let src = computed(() => "http://localhost:4200/requirement-refinement/dynamic?file-address=assets/simulations_results&sim_id="+simId+"&response_index="+responseIndex+"&scenario_id="+scenarioId+"&sel="+sel+"&tbv_timed="+tbvTimed+"&predicates="+predicates)
//let src = computed(() => "http://"+config.public.tqPropRefinerDomain+":"+config.public.tqPropRefinerPort+"/requirement-refinement/shortcut?file-address=assets/simulations_results&sim_id="+simId.value+"&pattern="+pattern.value)

</script>

<template>

	<!-- TODO navigate to scenario -->
  <button>Finish Refinement</button>
  <br>
  <br>

  <div>
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