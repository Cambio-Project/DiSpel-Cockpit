<script>
// Allows sorting objects by a property
const byProperty = function (prop, direction) {
  return function (a, b) {
    if (direction) {
      if (typeof a[prop] == "number") {
        return (a[prop] - b[prop]);
      } else {
        return ((a[prop] < b[prop]) ? -1 : ((a[prop] > b[prop]) ? 1 : 0));
      }
    } else {
      if (typeof a[prop] == "number") {
        return (b[prop] - a[prop]);
      } else {
        return ((a[prop] < b[prop]) ? 1 : ((a[prop] > b[prop]) ? -1 : 0));
      }
    }
  }
};

export default {
  name: "ScenarioList",
  el: '#app',
  scenariosNew: [],
  setup() {
    onMounted(async () => {
      preparePopups();
    });
  },
  watch: {
    'target': {
      handler() {
        this.changeAllTargets(this.scenarios, this.target)
      },
      deep: true
    },
  },
  computed: {
    sortingDirectionIcon: function () {
      if (this.sortDirectionDown) {
        return "i-heroicons-chevron-double-down"
      } else {
        return "i-heroicons-chevron-double-up"
      }
    },
    orderedScenarios: function () {
      switch (this.sort) {
        case "resilience":
          return this.scenarios.sort((a, b) => {
            const AResult = this.findResults(a.simulationID)
            const BResult = this.findResults(b.simulationID)
            let AResilienceScore = 0;
            if (AResult !== undefined) {
              AResilienceScore = AResult.resilienceScore
            }
            let BResilienceScore = 0;
            if (BResult !== undefined) {
              BResilienceScore = BResult.resilienceScore
            }
            if (this.sortDirectionDown) {
              return BResilienceScore - AResilienceScore
            } else {
              return AResilienceScore - BResilienceScore
            }
          })
        case "category":
          return this.scenarios.sort(byProperty("category", this.sortDirectionDown))
        case "name":
          return this.scenarios.sort(byProperty("name", this.sortDirectionDown))
        default:
          return this.scenarios
      }
    }
  },
  data() {
    return {
      scenarioContents: [{
        key: 'description',
        label: 'Description'
      }, {
        key: 'stimulus',
        label: 'Stimulus'
      }, {
        key: 'response',
        label: 'Response'
      }, {
        key: 'environment',
        label: 'Environment'
      }],
      sortOptions: [{
        key: 'none',
        label: 'None'
      }, {
        key: 'resilience',
        label: 'Resilience Score'
      }, {
        key: 'name',
        label: 'Name'
      }, {
        key: 'category',
        label: 'Category'
      }],
      targetLogics: [
        {name: "SEL", id: 0},
        {name: "LTL", id: 1},
        {name: "MTL", id: 2},
        {name: "Prism", id: 3},
        {name: "Quantitative Prism", id: 4},
        {name: "TBV (untimed)", id: 5},
        {name: "TBV (timed)", id: 6}
      ],
      target: null,
      results: null,
      scenarios: [],
      sort: null,
      sortDirectionDown: true,
      showTransformations: false
    };
  },
  methods: {
    getSearchVerificationResultsPerScenario,
    getSimulationVerificationResultsPerScenario,
    getResilienceScore,
    getResilienceScoreColor,
    getSearchVerificationResultsPerResponse,
    getSimulationVerificationResultsPerResponse,
    downloadJSON,
    downloadZip,
    startScenarioSearch,
    startScenarioSimulation,
    changeAllTargets,
    toScenarioEditor,
    toScenarioDetails,
    // Open the ScenarioEditor with to create a new scenario
    async openEditor() {
      let simulationID = await initScenario()
      toScenarioEditor(simulationID, this.$router)
    },
    async updateResults() {
      const response = await allResults()
      const bodyResults = await response.json();
      this.results = bodyResults.results
    },
    findResults(simID) {
      if (this.results === undefined) {
        return
      }
      for (let result of this.results) {
        if (result.simulationID === simID) {
          return result
        }
      }
    },
    isSimulationVerificationRequired(simID) {
      const result = this.findResults(simID)
      let updateRequired = false
      if (result !== undefined) {
        updateRequired = result.simulationUpdateRequired
      }
      return updateRequired
    },
    isSearchVerificationRequired(simID) {
      const result = this.findResults(simID)
      let updateRequired = false
      if (result !== undefined) {
        updateRequired = result.searchUpdateRequired
      }
      return updateRequired
    },
    // Remove one scenario
    async removeScenario(simulationID) {
      await deleteScenario(simulationID)
      this.scenarios = await allScenarios();
    },
    async verifyScenario(scenario) {
      await successMessage("Starting Verification", "Please wait!")
      await verifySimulation(scenario)
      await this.updateResults()
      scenario.analysisState = 'simverified';
      await successMessage("Simulation Results verified", "Results have been updated")
    },
    async verifySearch(scenario) {
      await successMessage("Starting Verification", "Please wait!")
      await verifySearch(scenario)
      await this.updateResults()
      scenario.analysisState = 'searchverified';
      await successMessage("Monitoring Results verified", "Results have been updated")
    },
    async initiateSimulation(scenario) {
      await startScenarioSimulation(scenario);
      await this.updateResults();
    },
    async initiateSearch(scenario) {
      await startScenarioSearch(scenario);
      await this.updateResults();
    },
    toggleSortingDirection() {
      this.sortDirectionDown = !this.sortDirectionDown
    }
  },
  async beforeMount() {
    await this.updateResults()
    this.scenarios = await allScenarios()

    for (let i = 0; i < this.scenarios.length; i++) {
      this.scenarios[i].analysisState = "none"
    }
  },
};
</script>

<template>
  <!--Mainframe-->
  <div>
    <!--Tools-->
    <UContainer>
      <div class="container-row mt-2 mb-4">
        <div class="float-left container-row-element">
          <UButton icon="i-heroicons-plus" class="float-left mr-4" color="green" size="lg" @click="openEditor">New
            Scenario
          </UButton>
          <UButton icon="i-heroicons-cloud-arrow-down-16-solid" class="float-left" size="lg" @click="downloadZip()">
            Download Scenarios
          </UButton>
        </div>
        <div class="float-right container-row-element-s">
          <UCheckbox v-model="this.showTransformations" label="Show Transformations" class="mt-2"/>
        </div>
        <div class="float-right container-row-element-s">
          <USelectMenu placeholder="Transform to Target Logic" v-model="target" :options="targetLogics"
                       value-attribute="id" size="lg"
                       option-attribute="name"/>
        </div>
        <div class="container-row-element-s ml-2">
          <UButtonGroup class="w-full" :class="w-full" size="lg" orientation="horizontal">
            <USelectMenu
                :class="'w-full'"
                v-model="sort"
                :options="sortOptions"
                placeholder="Sort by"
                value-attribute="key"
                option-attribute="label"
            />
            <UButton :icon="sortingDirectionIcon" color="gray" @click="toggleSortingDirection()"/>
          </UButtonGroup>
        </div>
      </div>
    </UContainer>

    <UContainer>
      <div>
        <template v-for="scenario in orderedScenarios">
          <div class="scenario-box mt-4 mb-4"
               :style="{'border-color': getResilienceScoreColor(this.findResults(scenario.simulationID))}">
            <!-- Scenario Header -->
            <div class="container-row mt-1 mb-1">
              <!-- Category -->
              <div class="container-row-element-xs left ml-2">
                <div class="container-row">
                  <div class="container-row-element-xs">
                    <UButton :icon="getScenarioTypeIcon(scenario.category)" :ui="{ rounded: 'rounded-full' }"
                             :color="getScenarioTypeColor(scenario.category)"
                             size="2xs" square/>
                  </div>
                  <div class="container-row-element ml-1">
                    {{ scenario.category }}
                  </div>
                </div>
              </div>

              <!-- Stimuli Counter -->
              <div class="container-row-element-xs">
                <Icon name="icon-park-solid:lightning" color="red"/>
                {{ scenario.stimuli.length }}
              </div>

              <!-- Response Counter -->
              <div class="container-row-element-xs">
                <Icon name="material-symbols:ecg-heart" color="purple"/>
                {{ scenario.responses.length }}
              </div>

              <!-- ID -->
              <div class=" container-row-element text-gray-300">
                {{ "ID: " + scenario.simulationID }}
              </div>

              <!-- Buttons -->
              <div class="container-row-element-s">
                <div class="float-right">
                  <UButton class="mr-1" icon="i-heroicons-pencil-square-16-solid" square size="xs" color="blue"
                           @click="toScenarioEditor(scenario.simulationID);"></UButton>
                  <UButton class="mr-1" icon="i-heroicons-document-magnifying-glass-16-solid" square size="xs"
                           color="blue"
                           @click="toScenarioDetails(scenario.simulationID)"></UButton>
                  <UButton class="mr-1" icon="i-heroicons-cloud-arrow-down-16-solid" square size="xs" color="blue"
                           @click="downloadJSON(scenario.simulationID);"></UButton>
                  <UButton class="mr-1" icon="i-heroicons-trash-16-solid" square size="xs" color="red"
                           @click="removeScenario(scenario.simulationID);"></UButton>
                </div>
              </div>
            </div>


            <UDivider></UDivider>

            <!-- Scenario Title -->
            <div class="container-row mt-1 mb-1">
              <div class="container-row-element ml-2 mr-2">
                <div class="scenario-title font-bold">
                  {{ scenario.name }}
                </div>
              </div>
            </div>

            <UDivider></UDivider>

            <!-- Scenario Contents -->
            <UTabs :items="scenarioContents" class="w-full"
                   :ui="{ list: {background: '', marker:{background: 'bg-gray-300'}} }">
              <template #item="{ item }">
                <UContainer class="mt-4 mb-4" style="min-height: 5em;">

                  <!-- Description Tab -->
                  <div v-if="item.key === 'description'" class="left">
                    {{ scenario.description }}
                  </div>

                  <!-- Stimulus Tab -->
                  <div v-if="item.key === 'stimulus'">
                    <span>
                <!--{{scenario.responses[0]}}-->
                <ul>
                <li v-for="(stimulus, index) in scenario.stimuli" :key="stimulus" class="mb-1">
                  <div class="container-row">
                    <div class="container-row-element-xxs">
                      {{ index + 1 }}.
                    </div>
                    <div class="container-row-element">
                       <i class="left"> <strong> {{ stimulus.SEL }} </strong> </i>
                      <div v-if="showTransformations" class="container-row">
                      <div class="container-row-element-xs">
                      <USelectMenu class="foreground" v-model="stimulus.target_logic" :options="targetLogics"
                                   value-attribute="id"
                                   option-attribute="name"/>
                      </div>
                      <div class="container-row-element ml-2 left">
                <span v-if="stimulus.target_logic===0">
                  {{ stimulus.SEL }}
                </span>
                <span v-if="stimulus.target_logic===1">
                  {{ stimulus.LTL }}
                </span>
                <span v-if="stimulus.target_logic===2">
                  {{ stimulus.MTL }}
                </span>
                <span v-if="stimulus.target_logic===3">
                  {{ stimulus.Prism }}
                </span>
                <span v-if="stimulus.target_logic===4">
                  {{ stimulus.Quantitative_Prism }}
                </span>
                <span v-if="stimulus.target_logic===5">
                  {{ stimulus.TBV_untimed }}
                </span>
                <span v-if="stimulus.target_logic===6">
                  {{ stimulus.TBV_timed }}
                </span>
                      </div>
                    </div>
                    </div>
                  </div>
              </li>
              </ul>
              </span>
                  </div>

                  <!-- Response Tab -->
                  <div v-if="item.key === 'response'">
              <span>
                <ul>
                <li v-for="(response, index) in scenario.responses" :key="response" class="mb-1">
                <div class="container-row">
                  <div class="container-row-element-xs">
                    <!-- Response Statistics -->
                  <div class="container-row">
                  <div class="container-row-element-s">
                    <span>{{ index + 1 }}.</span>
                  </div>
                   <div class="container-row-element">
                    <span> <Icon name="heroicons:globe-alt-20-solid" size="1.3em" class="mb-1 mr-1"></Icon>{{
                        getSimulationVerificationResultsPerResponse(this.findResults(scenario.simulationID), index)
                      }}</span>
                  </div>
                  <div class="container-row-element">
                    <span> <Icon name="heroicons:chart-bar-16-solid" size="1.3em" class="mb-1 mr-1"></Icon>{{
                        getSearchVerificationResultsPerResponse(this.findResults(scenario.simulationID), index)
                      }}</span>
                  </div>

                  </div>
                  </div>

                  <div class="container-row-element">
                <span>
                <i class="left"> <strong> {{ response.SEL }} </strong> </i>
                    <div v-if="showTransformations" class="container-row">
                      <div class="container-row-element-xs">
                      <USelectMenu v-model="response.target_logic" :options="targetLogics" value-attribute="id"
                                   option-attribute="name"/>
                      </div>
                      <div class="container-row-element ml-2 left">
                <span v-if="response.target_logic===0">
                  {{ response.SEL }}
                </span>
                <span v-if="response.target_logic===1">
                  {{ response.LTL }}
                </span>
                <span v-if="response.target_logic===2">
                  {{ response.MTL }}
                </span>
                <span v-if="response.target_logic===3">
                  {{ response.Prism }}
                </span>
                <span v-if="response.target_logic===4">
                  {{ response.Quantitative_Prism }}
                </span>
                <span v-if="response.target_logic===5">
                  {{ response.TBV_untimed }}
                </span>
                <span v-if="response.target_logic===6">
                  {{ response.TBV_timed }}
                </span>
                      </div>
                    </div>
              </span>
              </div>
              </div>

              </li>
              </ul>
              </span>
                  </div>

                  <!-- Environment Tab -->
                  <div v-if="item.key === 'environment'" class="left">
                    <ul>
                      <li v-for="architecture in scenario.environment.architecture">
                        - <strong>Architecture:</strong> <i>{{ Object.keys(architecture)[0] }}</i>
                      </li>
                    </ul>
                    <ul>
                      <li v-for="experiment in scenario.environment.experiment">
                        - <strong>Experiment:</strong> <i>{{ Object.keys(experiment)[0] }}</i>
                      </li>
                    </ul>
                    <ul>
                      <li v-for="load in scenario.environment.load">
                        - <strong>Load Profile:</strong> <i>{{ Object.keys(load)[0] }}</i>
                      </li>
                    </ul>
                    <ul>
                      <li v-for="monitoringData in scenario.environment.monitoringData">
                        - <strong>Monitoring Data:</strong> <i>{{ Object.keys(monitoringData)[0] }}</i>
                      </li>
                    </ul>
                    <div>
                      - <strong>Search Window Size:</strong> {{ scenario.searchWindowSize }}
                    </div>
                  </div>
                </UContainer>
              </template>
            </UTabs>

            <UDivider></UDivider>

            <!-- Footer -->
            <div class="container-row ">
              <div class="container-row-element-s pt-2 pb-1"
                   :style="{ 'background-color': getResilienceScoreColor(this.findResults(scenario.simulationID))}">
                    <span>
                  {{ getResilienceScore(this.findResults(scenario.simulationID)) }}
                    </span>
              </div>

              <div class="container-row-element-s pt-2 pb-1">
                    <span> <Icon name="heroicons:globe-alt-20-solid" size="1.3em" class="mb-1 mr-1"></Icon>{{
                        getSimulationVerificationResultsPerScenario(this.findResults(scenario.simulationID))
                      }}</span>
              </div>

              <div class="container-row-element-s pt-2 pb-1">
                    <span> <Icon name="heroicons:chart-bar-16-solid" size="1.3em" class="mb-1 mr-1"></Icon>{{
                        getSearchVerificationResultsPerScenario(this.findResults(scenario.simulationID))
                      }}</span>
              </div>

              <div class="container-row-element pt-1 pb-1">
                <div v-if="scenario.analysisState === 'simrunning'">
                  <UProgress animation="carousel"></UProgress>
                  <p>Simulation is running</p>
                </div>
                <div v-if="scenario.analysisState === 'searchrunning'">
                  <UProgress animation="carousel"></UProgress>
                  <p>Search is running</p>
                </div>
                <div v-if="scenario.analysisState === 'simdone'">
                  <p class="mt-1">
                    <Icon name="heroicons:check" color="green" size="1.3em" class="mb-1 mr-1"/>
                    Simulation finished! Please verify results!
                  </p>
                </div>
                <div v-if="scenario.analysisState === 'searchdone'">
                  <p class="mt-1">
                    <Icon name="heroicons:check" color="green" size="1.3em" class="mb-1 mr-1"/>
                    Search finished! Please verify results!
                  </p>
                </div>
                <div v-if="scenario.analysisState === 'simfailed'">
                  <p class="mt-1">
                    <Icon name="heroicons:no-symbol" color="red" size="1.3em" class="mb-1 mr-1"/>
                    Simulation failed! Please check container logs!
                  </p>
                </div>
                <div v-if="scenario.analysisState === 'searchfailed'">
                  <p class="mt-1">
                    <Icon name="heroicons:no-symbol" color="red" size="1.3em" class="mb-1 mr-1"/>
                    Search failed! Please check container logs!
                  </p>
                </div>
                <div v-if="scenario.analysisState === 'simverified'">
                  <p class="mt-1">
                    <Icon name="heroicons:check" color="green" size="1.3em" class="mb-1 mr-1"/>
                    Simulation results verified! Metrics updated!
                  </p>
                </div>
                <div v-if="scenario.analysisState === 'searchverified'">
                  <p class="mt-1">
                    <Icon name="heroicons:check" color="green" size="1.3em" class="mb-1 mr-1"/>
                    Search results verified! Metrics updated!
                  </p>
                </div>
              </div>

              <div class="container-row-element-s pt-1 pb-1">
<span class="float-right">
  <UButton class="mr-1" icon="i-heroicons-globe-alt-20-solid" square size="xs" color="blue"
           @click="initiateSimulation(scenario)"></UButton>
  <UButton class="mr-1" icon="i-heroicons-check-16-solid"
           :class="{ 'blue-glowing-button' : isSimulationVerificationRequired(scenario.simulationID)}" square
           size="xs"
           color="blue"
           @click="verifyScenario(scenario)"></UButton>
  <UButton class="mr-1" icon="i-heroicons-chart-bar-16-solid" square size="xs" color="blue"
           @click="initiateSearch(scenario)"></UButton>
  <UButton class="mr-1" icon="i-heroicons-check-16-solid"
           :class="{ 'blue-glowing-button' : isSearchVerificationRequired(scenario.simulationID)}" square
           size="xs"
           color="blue"
           @click="verifySearch(scenario)"></UButton>
</span>
              </div>
            </div>

          </div>
        </template>
      </div>
    </UContainer>
  </div>
</template>


<style scoped>

body {
  font-family: 'Arial', sans-serif;
  background-color: #f4f4f4;
}

</style>