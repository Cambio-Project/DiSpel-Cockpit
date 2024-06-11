<script>

export default {
  name: "ScenarioList",
  el: '#app',
  scenariosNew: [],
  setup() {
    onMounted(async () => {
      preparePopups();
    });
  },
  data() {
    return {
      simID: this.$route.query.simID,
      targetLogics: ["SEL", "LTL", "MTL", "Prism", "Quantitative Prism", "TBV (untimed)", "TBV (timed)"],
      target: null,
      result: null,
      scenario: null,
      accordionItems: [{
        label: 'Scenario',
        icon: 'i-heroicons-information-circle',
        defaultOpen: true,
        slot: 'scenario'
      }, {
        label: 'Stimuli',
        icon: 'i-heroicons-bolt',
        defaultOpen: true,
        slot: 'stimuli'
      }, {
        label: 'Responses',
        icon: 'i-heroicons-heart',
        defaultOpen: true,
        slot: 'responses'
      }, {
        label: 'Environment',
        icon: 'i-heroicons-code-bracket',
        defaultOpen: true,
        slot: 'environment'
      }, {
        label: 'Results',
        icon: 'i-heroicons-chart-pie',
        defaultOpen: true,
        slot: 'results'
      }, {
        label: 'Simulation',
        icon: 'i-heroicons-globe-alt',
        defaultOpen: true,
        slot: 'simulation'
      }, {
        label: 'Monitoring',
        icon: 'i-heroicons-chart-bar',
        defaultOpen: true,
        slot: 'monitoring'
      }]
    };
  },
  methods: {
    deleteResult,
    changeAllTargets,
    getSearchVerificationResultsPerScenario,
    getSimulationVerificationResultsPerScenario,
    getResilienceScore,
    getResilienceScoreColor,
    mapResultToColor,
    downloadJSON,
    startScenarioSimulation,
    startScenarioSearch,
    toScenariosOverview,
    toScenarioEditor,
    toRefinement,
    async toggleDetails(stimulus) {
      if (stimulus.showDetails === undefined) {
        stimulus.showDetails = true
      } else {
        stimulus.showDetails = !stimulus.showDetails
      }
    },
    // Open the ScenarioEditor with to create a new scenario
    async openEditor() {
      const simulationID = await initScenario();
      toScenarioEditor(simulationID, this.$router);
    },
    async updateResults() {
      this.result = await getResult(this.simID);
    },
    // Remove one scenario
    async removeScenario(simulationID) {
      await deleteScenario(simulationID)
      toScenariosOverview(this.$router)
    },
    async verifyScenario(scenario) {
      await verifySimulation(scenario)
      await this.updateResults()
    },
    async verifySearch(scenario) {
      await verifySearch(scenario)
      await this.updateResults()
    },
    async initiateSimulation(scenario) {
      await startScenarioSimulation(scenario);
      await this.updateResults();
    },
    async initiateSearch(scenario) {
      await startScenarioSearch(scenario);
      await this.updateResults();
    },
    isSimulationVerificationRequired() {
      const result = this.result
      let updateRequired = false
      if (result !== undefined) {
        updateRequired = result.simulationUpdateRequired
      }
      return updateRequired
    },
    isSearchVerificationRequired() {
      const result = this.result
      let updateRequired = false
      if (result !== undefined) {
        updateRequired = result.searchUpdateRequired
      }
      return updateRequired
    },
    async deleteResultAndUpdate(type, simulationID, executionID, executionIndex) {
      await deleteResult(type, simulationID, executionID, executionIndex);
      await this.updateResults();
    },
    async deleteAllSimulationResultAndUpdate(simulationID) {
      if (this.result === undefined || this.result.simulationNames === undefined) {
        return
      }
      for (const executionID of this.result.simulationNames) {
        await deleteResult("simulation", simulationID, executionID, 0);
      }
      await this.updateResults();
    },
    async deleteAllSearchResultAndUpdate(simulationID) {
      for (const executionID of this.result.searchNames) {
        await deleteResult("search", simulationID, executionID, 0);
      }
      await this.updateResults();
    },
    findSearchResults(result, resultIndex, responseIndex) {
      if (result.searchResults !== undefined && result.searchResults[resultIndex] !== undefined && result.searchResults[resultIndex][responseIndex] !== undefined) {
        return result.searchResults[resultIndex][responseIndex]
      } else {
        return undefined
      }
    },
    findSimulationResults(result, resultIndex, responseIndex) {
      if (result.simulationResults !== undefined && result.simulationResults[resultIndex] !== undefined && result.simulationResults[resultIndex][responseIndex] !== undefined) {
        return result.simulationResults[resultIndex][responseIndex]
      } else {
        return undefined
      }
    },
  },
  async beforeMount() {
    await this.updateResults()
    this.scenario = await getScenario(this.$route.query.simID);

    this.scenario.simState = "none"
    this.scenario.mosimState = "none"
  },
};
</script>

<template>
  <div v-if="scenario">
    <!--Headline-->
    <div class="mb-2 mt-2">
      <h1 class="text-3xl">Title: {{ scenario.name }} </h1>

      <div class="text-gray-300">
        {{ "Scenario-ID: " + scenario.simulationID }}
      </div>

      <div class="center mt-2 mb-2">
        <UButton class="mr-1" icon="i-heroicons-pencil-square-16-solid" square size="xs" color="blue"
                 @click="toScenarioEditor(scenario.simulationID);"></UButton>
        <UButton class="mr-1" icon="i-heroicons-cloud-arrow-down-16-solid" square size="xs" color="blue"
                 @click="downloadJSON(scenario.simulationID);"></UButton>
        <UButton class="mr-1" icon="i-heroicons-trash-16-solid" square size="xs" color="red"
                 @click="removeScenario(scenario.simulationID);"></UButton>
      </div>
    </div>

    <UContainer>
      <UAccordion :items="accordionItems" multiple>
        <template #scenario>
          <UContainer>
            <div class="mb-1 mt-1 left">
              <h4 class="text-mb font-bold mb-2">
                Type:
              </h4>

              <UBadge v-if="scenario.category === 'None' " color="gray" class="customCategory">
                {{ 'None category defined' }}
              </UBadge>

              <UBadge v-if="scenario.category === 'Exploratory' " color="purple" class="customCategory">
                {{ 'Exploratory' }}
              </UBadge>

              <UBadge v-if="scenario.category === 'Growth' " color="blue" class="customCategory">
                {{ 'Growth' }}
              </UBadge>

              <UBadge v-if="scenario.category === 'UseCase' " color="yellow" class="customCategory">
                {{ 'Use Case' }}
              </UBadge>
            </div>

            <div class="left mb-2 mt-2">
              <h4 class="text-mb font-bold mb-1">
                Description:
              </h4>
              {{ scenario.description }}
            </div>
          </UContainer>
        </template>


        <template #stimuli>
          <UContainer>
            <ul>
              <li v-for="(stimulus, index) in scenario.stimuli" :key="stimulus" class="left">
                <div class="container-row">
                  <div class="container-row-element-xxs">
                    {{ index + 1 }}.
                    <UButton class="ml-2" square v-if="!stimulus.showDetails" color="gray" size="2xs"
                             icon="i-heroicons-chevron-down" @click="toggleDetails(stimulus)"></UButton>
                    <UButton class="ml-2" square v-if="stimulus.showDetails" color="gray" size="2xs"
                             icon="i-heroicons-chevron-up" @click="toggleDetails(stimulus)"></UButton>
                  </div>
                  <div class="container-row-element">
                    <strong>{{ stimulus.SEL }}</strong>
                    <div>
                      <span v-if="stimulus.showDetails">
                        <ul>
                          <li>
                        <i> <strong>- SEL:</strong> {{ stimulus.SEL }} </i>
                          </li>
                          <li>
                        <i> <strong>- LTL:</strong> {{ stimulus.LTL }} </i>
                          </li>
                          <li>
                        <i> <strong>- MTL:</strong> {{ stimulus.MTL }} </i>
                          </li>
                          <li>
                            <i> <strong>- PRISM:</strong> {{ stimulus.Prism }} </i>
                          </li>
                          <li>
                        <i> <strong>- QUANTITATIVE PRISM:</strong> {{ stimulus.Quantitative_Prism }} </i>
                          </li>
                          <li>
                            <i> <strong>- TBV (untimed):</strong> {{ stimulus.TBV_untimed }} </i>
                          </li>
                          <li>
                            <i> <strong>- TBV:</strong> {{ stimulus.TBV_timed }} </i>
                          </li>
                        </ul>
                        </span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </UContainer>
        </template>


        <template #responses>
          <UContainer>
            <ul>
              <li v-for="(response, index) in scenario.responses" :key="response" class="left">
                <div class="container-row">
                  <div class="container-row-element-xxs">
                    {{ index + 1 }}.
                    <UButton class="ml-2" square v-if="!response.showDetails" color="gray" size="2xs"
                             icon="i-heroicons-chevron-down" @click="toggleDetails(response)"></UButton>
                    <UButton class="ml-2" square v-if="response.showDetails" color="gray" size="2xs"
                             icon="i-heroicons-chevron-up" @click="toggleDetails(response)"></UButton>
                  </div>
                  <div class="container-row-element">
                    <strong>{{ response.SEL }}</strong>
                    <div>
                      <span v-if="response.showDetails">
                        <ul>
                          <li>
                        <i> <strong>- SEL:</strong> {{ response.SEL }} </i>
                          </li>
                          <li>
                        <i> <strong>- LTL:</strong> {{ response.LTL }} </i>
                          </li>
                          <li>
                        <i> <strong>- MTL:</strong> {{ response.MTL }} </i>
                          </li>
                          <li>
                            <i> <strong>- PRISM:</strong> {{ response.Prism }} </i>
                          </li>
                          <li>
                        <i> <strong>- QUANTITATIVE PRISM:</strong> {{ response.Quantitative_Prism }} </i>
                          </li>
                          <li>
                            <i> <strong>- TBV (untimed):</strong> {{ response.TBV_untimed }} </i>
                          </li>
                          <li>
                            <i> <strong>- TBV:</strong> {{ response.TBV_timed }} </i>
                          </li>
                        </ul>
                        </span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </UContainer>
        </template>


        <template #environment>
          <UContainer>
            <div class="left">
              <ul>
                <li v-for="architecture in scenario.environment.architecture">
                  - <strong>Architecture</strong>: <i>{{ Object.keys(architecture)[0] }}</i>
                </li>
              </ul>
              <ul>
                <li v-for="experiment in scenario.environment.experiment">
                  - <strong>Experiment</strong>: <i>{{ Object.keys(experiment)[0] }}</i>
                </li>
              </ul>
              <ul>
                <li v-for="load in scenario.environment.load">
                  - <strong>Load Profile</strong>: <i>{{ Object.keys(load)[0] }}</i>
                </li>
              </ul>
              <ul>
                <li v-for="monitoringData in scenario.environment.monitoringData">
                  - <strong>Monitoring Data</strong>: <i>{{ Object.keys(monitoringData)[0] }}</i>
                </li>
              </ul>
              <div class="left">
                - <strong>Search Window Size</strong>: {{ scenario.searchWindowSize }}
              </div>
            </div>
          </UContainer>
        </template>


        <template #results>
          <div v-if="result == null">
            <h4 class="text-mb font-bold mb-1 text-center">
              Currently, no results are available. Execute and verify tests.
            </h4>
          </div>
          <div v-if="result !== null">
            <div class="left mb-4 container-row">
              <UContainer style="width:100%;">
                <h4 class="text-mb font-bold mb-1 text-center">
                  Resilience Score:
                </h4>
                <UCard :style="{ 'background-color': getResilienceScoreColor(this.result)}"
                       class='text-center text-2xl font-bold simple-shadow'>
              <span>
                    {{ getResilienceScore(this.result) }}
              </span>
                </UCard>
              </UContainer>

              <UContainer style="width:100%;">
                <h4 class="text-mb font-bold mb-1 text-center">
                  Simulation Response Satisfaction:
                </h4>
                <UCard class='text-center text-2xl font-bold simple-shadow'>
              <span>
                    {{ getSimulationVerificationResultsPerScenario(this.result) }}
              </span>
                </UCard>
              </UContainer>

              <UContainer style="width:100%;">
                <h4 class="text-mb font-bold mb-1 text-center">
                  Monitoring Response Satisfaction:
                </h4>
                <UCard class='text-center text-2xl font-bold simple-shadow'>
              <span>
                    {{ getSearchVerificationResultsPerScenario(this.result) }}
              </span>
                </UCard>
              </UContainer>
            </div>

            <UContainer class="left">
              <h4 class="text-mb font-bold mb-1">
                Individual Response Satisfaction:
              </h4>

              <span>
                <ul>
                <li v-for="(response, index) in scenario.responses" :key="response" class="left">
                <div class="container-row">
                  <div class="container-row-element-xs">
                    <!-- Response Statistics -->
                  <div class="container-row">
                  <div class="container-row-element-s">
                    <span>{{ index + 1 }}.</span>
                  </div>
                   <div class="container-row-element">
                    <span> <Icon name="heroicons:globe-alt-20-solid" size="1.3em" class="mb-1 mr-1"></Icon>{{
                        getSimulationVerificationResultsPerResponse(this.result, index)
                      }}</span>
                  </div>
                  <div class="container-row-element">
                    <span> <Icon name="heroicons:chart-bar-16-solid" size="1.3em" class="mb-1 mr-1"></Icon>{{
                        getSearchVerificationResultsPerResponse(this.result, index)
                      }}</span>
                  </div>
                  </div>
                  </div>
                  <div class="container-row-element mt-1">
                <span>
                <i> <strong> {{ response.SEL }} </strong></i>
              </span>
              </div>
              </div>
              </li>
              </ul>
              </span>
            </UContainer>
          </div>
        </template>


        <template #simulation>
          <UContainer>
            <div v-if="result == null">
              <h4 class="text-mb font-bold mb-1 text-center">
                Currently, no results are available. Execute and verify tests.
              </h4>
            </div>
            <div v-if="result !== null">
              <UDivider label="Actions" class="mb-1"/>
              <UButton class="mr-1" icon="i-heroicons-globe-alt-20-solid" square size="xs" color="blue"
                       @click="initiateSimulation(scenario)"></UButton>
              <UButton class="mr-1" icon="i-heroicons-check-16-solid"
                       :class="{ 'blue-glowing-button' : isSimulationVerificationRequired(scenario.simulationID)}"
                       square
                       size="xs"
                       color="blue"
                       @click="verifyScenario(scenario)"></UButton>
              <UButton class="mr-1" icon="i-heroicons-trash-16-solid" square size="xs" color="red"
                       @click="deleteAllSimulationResultAndUpdate(scenario.simulationID);"></UButton>

              <UDivider label="Executions" class="mt-2 mb-2"/>
              <div v-for="(resultName,resultIndex) in result.simulationNames">
                <div class="scenario-box mb-4"
                     :class="{ 'green-border' : this.result.searchResultsScenarioSuccesses[resultIndex], 'red-border' : !this.result.searchResultsScenarioSuccesses[resultIndex] }">
                  <div class="container-row">
                    <div class="container-element-xs w-full">
                    </div>
                    <div class="container-row-element text-center">
                      <div class="scenario-title font-bold">
                        {{ resultName }}
                      </div>
                      <div>
                        &lt;Simulation Execution&gt;
                      </div>
                    </div>
                    <div class="container-element-xs w-full">
                      <div class="float-right mt-1">
                        <UButton class="mr-1" icon="i-heroicons-trash-16-solid" square size="xs" color="red"
                                 @click="deleteResultAndUpdate('simulation', scenario.simulationID, resultName, resultIndex);"></UButton>
                      </div>
                    </div>
                  </div>
                  <UDivider/>

                  <UContainer>
                    <ul>
                      <li v-for="(response, index) in scenario.responses" :key="response" class="left">
                        <div class="container-row">
                          <div class="container-row-element-xxs mt-2">
                            {{ index + 1 }}.
                          </div>
                          <div class="container-row-element-xxs ">
                            <div class="container-row">
                              <div class="container-row-element">
                                <UTooltip v-if="findSimulationResults(result, resultIndex, index)"
                                          text="Response Satisfied">
                                  <UButton class="mr-1" square size="xs"
                                           color="green"
                                           variant="outline"
                                           icon="i-heroicons-check"
                                  />
                                </UTooltip>
                                <UTooltip v-if="!findSimulationResults(result, resultIndex, index)"
                                          text="Response Unsatisfied">
                                  <UButton class="mr-1" square size="xs"
                                           color="red"
                                           variant="outline"
                                           icon="i-heroicons-no-symbol"
                                  />
                                </UTooltip>
                              </div>
                              <div class="container-row-element">
                                <UTooltip text="Refine Response">
                                  <UButton class="mr-1" icon="i-heroicons-arrow-path" square size="xs"
                                           @click="toRefinement(scenario.simulationID, index, resultName, true);"></UButton>
                                </UTooltip>
                              </div>
                            </div>
                          </div>
                          <div class="container-row-element mt-2">
                            <i class="sel-line"
                               :style="{'color': mapResultToColor(findSimulationResults(result, resultIndex, index))}">
                              <strong>{{ response.SEL }}</strong> </i>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </UContainer>
                </div>
              </div>
            </div>
          </UContainer>
        </template>


        <template #monitoring>
          <UContainer class="mb-1">
            <div v-if="result == null">
              <h4 class="text-mb font-bold mb-1 text-center">
                Currently, no results are available. Execute and verify tests.
              </h4>
            </div>
            <div v-if="result !== null">
              <UDivider label="Actions" class="mb-1"/>
              <UButton class="mr-1" icon="i-heroicons-chart-bar-16-solid" square size="xs" color="blue"
                       @click="initiateSearch(scenario)"></UButton>
              <UButton class="mr-1" icon="i-heroicons-check-16-solid"
                       :class="{ 'blue-glowing-button' : isSearchVerificationRequired(scenario.simulationID)}" square
                       size="xs"
                       color="blue"
                       @click="verifySearch(scenario)"></UButton>
              <UButton class="mr-1" icon="i-heroicons-trash-16-solid" square size="xs" color="red"
                       @click="deleteAllSearchResultAndUpdate(scenario.simulationID);"></UButton>

              <UDivider label="Executions" class="mt-2 mb-2"/>
              <div v-for="(resultName,resultIndex) in result.searchNames">
                <div class="scenario-box mb-4"
                     :class="{ 'green-border' : this.result.searchResultsScenarioSuccesses[resultIndex], 'red-border' : !this.result.searchResultsScenarioSuccesses[resultIndex] }">
                  <div class="container-row">
                    <div class="container-element-xs w-full">
                    </div>
                    <div class="container-row-element text-center">
                      <div class="scenario-title font-bold">
                        {{ resultName }}
                      </div>
                      <div>
                        &lt;Monitoring Execution&gt;
                      </div>
                    </div>
                    <div class="container-element-xs w-full">
                      <div class="float-right mt-1">
                        <UButton class="mr-1" icon="i-heroicons-trash-16-solid" square size="xs" color="red"
                                 @click="deleteResultAndUpdate('search', scenario.simulationID, resultName, resultIndex);"></UButton>
                      </div>
                    </div>
                  </div>
                  <UDivider/>

                  <UContainer>
                    <ul>
                      <li v-for="(response, index) in scenario.responses" :key="response" class="left">
                        <div class="container-row">
                          <div class="container-row-element-xxs mt-2">
                            {{ index + 1 }}.
                          </div>
                          <div class="container-row-element-xxs ">
                            <div class="container-row">
                              <div class="container-row-element">
                                <UTooltip v-if="findSearchResults(result, resultIndex, index)"
                                          text="Response Satisfied">
                                  <UButton class="mr-1" square size="xs"
                                           color="green"
                                           variant="outline"
                                           icon="i-heroicons-check"
                                  />
                                </UTooltip>
                                <UTooltip v-if="!findSearchResults(result, resultIndex, index)"
                                          text="Response Unsatisfied">
                                  <UButton class="mr-1" square size="xs"
                                           color="red"
                                           variant="outline"
                                           icon="i-heroicons-no-symbol"
                                  />
                                </UTooltip>
                              </div>
                              <div class="container-row-element">
                                <UTooltip text="Refine Response">
                                  <UButton class="mr-1" icon="i-heroicons-arrow-path" square size="xs"
                                           @click="toRefinement(scenario.simulationID, index, resultName, false);"></UButton>
                                </UTooltip>
                              </div>
                            </div>
                          </div>
                          <div class="container-row-element mt-2">
                            <i class="sel-line"
                               :style="{'color': mapResultToColor(findSearchResults(result, resultIndex, index))}">
                              <strong>{{ response.SEL }}</strong> </i>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </UContainer>
                </div>
              </div>
            </div>
          </UContainer>
        </template>
      </UAccordion>
    </UContainer>

  </div>

  <div class="mt-2">
    <UButton @click="toScenariosOverview()">Complete</UButton>
  </div>
</template>


<style scoped>

.customCategory {
  border-radius: 40px !important;
}

.sel-line {
  margin: 0.8vw;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: #f4f4f4;
}

.left {
  text-align: left;
  overflow: auto;
  display: block;
}

.container-row {
  display: flex;
  padding: 5px;
}


</style>