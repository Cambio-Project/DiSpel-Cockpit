<script>
import JSZip from 'jszip';
import {
  allResults, allScenarios,
  deleteScenario,
  getScenario,
  initScenario,
  startSearch,
  startSimulation, verifySearch, verifySimulation
} from "~/components/composables/api.js";
import {toScenarioDetails, toScenarioEditor} from "~/components/composables/navigation.js";

export default {
  name: "ScenarioList",
  el: '#app',
  scenariosNew: [],
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
      targetLogics: ["SEL", "LTL", "MTL", "Prism", "Quantitative Prism", "TBV (untimed)", "TBV (timed)"],
      target: null,
      results: null,
      scenarios: null,
      popUp: null,
    };
  },
  methods: {
    toScenarioEditor,
    toScenarioDetails,
    // Open the ScenarioEditor with to create a new scenario
    async openEditor() {
      let simulationID = await initScenario()
      toScenarioEditor(simulationID, this.$router)
    },
    async startSimulation(scenario) {
      this.popUp.add({
        title: 'Simulation Started',
        description: 'SimID: ' + scenario.simulationID
      });
      scenario.simState = 'running';
      await startSimulation(scenario.simulationID)
      scenario.simState = 'done';
      return 'done'
    },
    async startSearch(scenario) {
      this.popUp.add({
        title: 'Search Started',
        description: 'SimID: ' + scenario.simulationID
      });
      scenario.mosimState = 'running';
      await startSearch(scenario.simulationID)
      scenario.mosimState = 'done';
      return 'done'
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
    // Remove one scenario
    async removeScenario(simulationID) {
      await deleteScenario(simulationID)
      this.scenarios = await allScenarios();
    },
    async verifyScenario(scenario) {
      await verifySimulation(scenario)
      await this.updateResults()
    },
    async verifySearch(scenario) {
      await verifySearch(scenario)
      await this.updateResults()
    },
    getSimulationVerificationResultsPerResponse(scenario, responseIndex) {
      const defaultResult = "0 / 0"
      const result = this.findResults(scenario.simulationID)
      if (result === undefined) {
        return defaultResult;
      }
      const totals = result.simulationResultsTotal;
      const successes = result.simulationResultsResponseSuccesses;
      if (totals === undefined || successes === undefined) {
        return defaultResult
      }
      return successes[responseIndex] + " / " + totals
    },
    getResilienceScore(scenario) {
      let resilienceScore = 0;
      const result = this.findResults(scenario.simulationID)
      if (result !== undefined && result.resilienceScore !== undefined) {
        resilienceScore = result.resilienceScore
      }
      return resilienceScore
    },
    getResilienceScoreColor(scenario) {
      //value from 0 to 1
      const value = 0.1 * this.getResilienceScore(scenario)
      const hue = ((value) * 12).toString(10);
      return ["hsl(", hue, ",100%,50%)"].join("");
    },
    getSearchVerificationResultsPerResponse(scenario, responseIndex) {
      const defaultResult = "0 / 0"
      const result = this.findResults(scenario.simulationID)
      if (result === undefined) {
        return defaultResult;
      }
      const totals = result.searchResultsTotal;
      const successes = result.searchResultsResponseSuccesses;
      if (totals === undefined || successes === undefined) {
        return defaultResult
      }
      return successes[responseIndex] + " / " + totals
    },
    getSearchVerificationResultsPerScenario(scenario) {
      const defaultResult = "0 / 0"
      const result = this.findResults(scenario.simulationID)
      if (result === undefined) {
        return defaultResult;
      }
      const totals = result.searchResultsTotal;
      const successes = result.searchResultsScenarioSuccessesTotal;
      if (totals === undefined || successes === undefined) {
        return defaultResult
      }
      return successes + " / " + totals
    },
    getSimulationVerificationResultsPerScenario(scenario) {
      const defaultResult = "0 / 0"
      const result = this.findResults(scenario.simulationID)
      if (result === undefined) {
        return defaultResult;
      }
      const totals = result.simulationResultsTotal;
      const successes = result.simulationResultsScenarioSuccessesTotal;
      if (totals === undefined || successes === undefined) {
        return defaultResult
      }
      return successes + " / " + totals
    },
    //Changes all target logics to the same one
    changeAllTargets() {
      this.scenarios.forEach(scenario => {
        scenario.responses.forEach(response => {
          response.target_logic = this.target;
        })
        scenario.stimuli.forEach(stimulus => {
          stimulus.target_logic = this.target;
        })
      });
    },
    //Download a single scenario as json
    async downloadJSON(simID) {
      const scenario = getScenario(simID)

      const jsonStr = JSON.stringify(scenario, null, 2);
      const blob = new Blob([jsonStr], {type: 'application/json'})
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      const fileName = 'Scenario_' + scenario.name + '.json';
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    //Download all scenarios as zip file
    async downloadZip() {
      const zip = new JSZip();
      let c = 1
      this.scenarios.forEach((scenario, index) => {
        const name = c + " - " + scenario.name;
        const jsonData = this.scenarios[index];
        zip.file('Scenario_' + name + '.json', JSON.stringify(jsonData, null, 2));
        c++;
      });

      const content = await zip.generateAsync({type: 'blob'});
      const url = window.URL.createObjectURL(content);

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'Scenarios.zip';
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  },
  async beforeMount() {
    await this.updateResults()
    this.scenarios = await allScenarios()

    for (let i = 0; i < this.scenarios.length; i++) {
      this.scenarios[i].simState = "none"
      this.scenarios[i].mosimState = "none"
    }

    this.popUp = useToast()

    console.log(this.scenarios)
  },
};
</script>

<template>
  <!--Headline-->
  <div class="mb-4 mt-2">
    <h1 class="text-3xl"> Scenarios </h1>
  </div>

  <!--Mainframe-->
  <div>
    <!--Tools-->
    <div>
      <UContainer class="mb-4 container-row">
        <div class="float-left container-row-element">
          <UButton class="float-left mr-4" size="lg" @click="openEditor">New Scenario</UButton>
          <UButton class="float-left downloadScenarios" size="lg" @click="downloadZip(index)">Download all Scenarios
          </UButton>
        </div>
        <div class="float-right container-row-element">
          <div class="float-right">
            {{ "Transform all Target Logics to " }}
            <select class="select-box" @change="changeAllTargets" v-model="target">
              <option v-for="targetLogic in targetLogics" :key="targetLogic" :value="targetLogics.indexOf(targetLogic)">
                {{ targetLogic }}
              </option>
            </select></div>
        </div>
      </UContainer>
    </div>

    <UContainer>
      <div>
        <template v-for="scenario in scenarios">
          <div class="scenario-box mt-4 mb-4">
            <!-- Scenario Header -->
            <div class="container-row mt-1 mb-1">
              <!-- Category -->
              <div class="container-row-element-xs">
                <UBadge :ui="{ rounded: 'rounded-full' }" v-if="scenario.category === 'None' " color="gray"
                        class="customCategory">{{ 'None' }}
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
            <UTabs :items="scenarioContents" class="w-full">
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
                <li v-for="(stimulus, index) in scenario.stimuli" :key="stimulus" class="left">
                {{ index + 1 }}.
                <span>
                <i class="sel-line"> <strong>SEL: </strong> {{ stimulus.SEL }} </i>
                </span>

                  <div>
                <select v-model="stimulus.target_logic" class="select-box mr-2">
                  <option v-for="targetLogic in targetLogics" :key="targetLogic"
                          :value="targetLogics.indexOf(targetLogic)">{{ targetLogic }}</option>
                </select>
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
              </li>
              </span>
                  </div>

                  <!-- Response Tab -->
                  <div v-if="item.key === 'response'">
              <span>
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
                        getSimulationVerificationResultsPerResponse(scenario, index)
                      }}</span>
                  </div>
                  <div class="container-row-element">
                    <span> <Icon name="heroicons:chart-bar-16-solid" size="1.3em" class="mb-1 mr-1"></Icon>{{
                        getSearchVerificationResultsPerResponse(scenario, index)
                      }}</span>
                  </div>

                  </div>
                  </div>

                  <div class="container-row-element">
                <span>
                <i> <strong>SEL:</strong> {{ response.SEL }} </i>
                <br>
                  <select v-model="response.target_logic" class="select-box mr-2">
                  <option v-for="targetLogic in targetLogics" :key="targetLogic"
                          :value="targetLogics.indexOf(targetLogic)">{{ targetLogic }}</option>
                </select>
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
              </span>
              </div>
              </div>

              </li>
              </span>
                  </div>

                  <!-- Environment Tab -->
                  <div v-if="item.key === 'environment'" class="left">
                    <ul>
                      <li v-for="architecture in scenario.environment.architecture">
                        - Architecture: <i>{{ Object.keys(architecture)[0] }}</i>
                      </li>
                    </ul>
                    <ul>
                      <li v-for="experiment in scenario.environment.experiment">
                        - Experiment: <i>{{ Object.keys(experiment)[0] }}</i>
                      </li>
                    </ul>
                    <ul>
                      <li v-for="load in scenario.environment.load">
                        - Load Profile: <i>{{ Object.keys(load)[0] }}</i>
                      </li>
                    </ul>
                    <ul>
                      <li v-for="monitoringData in scenario.environment.monitoringData">
                        - Monitoring Data: <i>{{ Object.keys(monitoringData)[0] }}</i>
                      </li>
                    </ul>
                    <div>
                      - Search Window Size: {{ scenario.searchWindowSize }}
                    </div>
                  </div>
                </UContainer>
              </template>
            </UTabs>

            <UDivider></UDivider>

            <!-- Footer -->
            <div class="container-row ">
              <div class="container-row-element-s pt-2 pb-1"
                   :style="{ 'background-color': getResilienceScoreColor(scenario)}">
                    <span>
                  {{ getResilienceScore(scenario) }}
                    </span>
              </div>

              <div class="container-row-element-s pt-2 pb-1">
                    <span> <Icon name="heroicons:globe-alt-20-solid" size="1.3em" class="mb-1 mr-1"></Icon>{{
                        getSimulationVerificationResultsPerScenario(scenario)
                      }}</span>
              </div>

              <div class="container-row-element-s pt-2 pb-1">
                    <span> <Icon name="heroicons:chart-bar-16-solid" size="1.3em" class="mb-1 mr-1"></Icon>{{
                        getSearchVerificationResultsPerScenario(scenario)
                      }}</span>
              </div>

              <div class="container-row-element pt-1 pb-1">
                <div v-if="scenario.simState === 'running'">
                  <UProgress animation="carousel"></UProgress>
                  <p>Simulation is running</p>
                </div>
                <!--
                <div v-if="scenario.simState === 'done'">
                  <p>Simulation is Done, you can now start the verify process</p>
                </div>
                -->
                <div v-if="scenario.mosimState === 'running'">
                  <UProgress animation="carousel"></UProgress>
                  <p>Search is running</p>
                </div>
                <!--
                <div v-if="scenario.mosimState === 'done'">
                <p>Search is Done, you can now start the verify process</p>
                 </div>                -->

              </div>

              <div class="container-row-element-s pt-1 pb-1">
<span class="float-right">
  <UButton class="mr-1" icon="i-heroicons-globe-alt-20-solid" square size="xs" color="blue"
           @click="startSimulation(scenario);"></UButton>
  <UButton :disabled="scenario.simState !== 'done'" class="mr-1" icon="i-heroicons-check-16-solid" square size="xs"
           color="blue"
           @click="verifyScenario(scenario)"></UButton>
  <UButton class="mr-1" icon="i-heroicons-chart-bar-16-solid" square size="xs" color="blue"
           @click="startSearch(scenario);"></UButton>
  <UButton :disabled="scenario.mosimState !== 'done'" class="mr-1" icon="i-heroicons-check-16-solid" square size="xs"
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

.headline-frame {
  background-color: #eaf6ff;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: -25px;
}

.headline {
  color: #333;
}

.main-frame {
  background-color: #d3d3d3;
  justify-content: center;
  align-items: center;
  display: block;
  height: 90vh;
  width: 100%;
  margin-top: -22px;
}

.tool-frame {
  height: 15%;
  width: 100%;
}

.file-download-button {
  background-color: #aacbe9;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 10px;
  margin: 20px 5px 5px;
  cursor: pointer;
  border-radius: 4px;
}

.file-download-button:hover {
  background-color: #9bb8d3;
}

.downloadScenarios:hover {
  background-color: #9bb8d3;
}

.downloadScenarios {
  background-color: #aacbe9;
}

.all-file-download-button {
  background-color: #aacbe9;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 20px;
  cursor: pointer;
  border-radius: 4px;
}

.all-file-download-button:hover {
  background-color: #9bb8d3;
}

.category-frame-0 {
  background-color: #cfcfcf;
  display: inline-block;
  border: 2px solid #888888;
  padding: 10px;
  justify-content: center;
  align-items: center;
  border-radius: 32px;
}

.category-frame-1 {
  background-color: #9a8fff;
  display: inline-block;
  border: 2px solid #6c5cff;
  padding: 10px;
  justify-content: center;
  align-items: center;
  border-radius: 32px;
}

.category-frame-2 {
  background-color: #98df9e;
  display: inline-block;
  border: 2px solid #1caf28;
  padding: 10px;
  justify-content: center;
  align-items: center;
  border-radius: 32px;
}


.customCategory {
  border-radius: 40px !important;
}

.category-frame-3 {
  background-color: #f0d98f;
  display: inline-block;
  border: 2px solid #ac9a61;
  padding: 10px;
  justify-content: center;
  align-items: center;
  border-radius: 32px;
}

.sel-line {
  margin: 0.8vw;
}

.new-button {
  background-color: rgb(114, 214, 101);
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 20px;
  cursor: pointer;
  border-radius: 4px;
}

.new-button:hover {
  background-color: rgb(73, 167, 61);
}

body {
  font-family: 'Arial', sans-serif;
  background-color: #f4f4f4;
}

.list-container {
  width: 95%;
  background-color: #fff;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 80%;
  margin-left: 2.5vw
}

.list-item {
  transition: background-color 0.3s;
  border-bottom: 2px solid #ccc;
  padding: 32px;
  display: block;
}

.list-item:hover {
  background-color: #f0f0f0;
}

.list-content {
  max-height: 100%;
  overflow-y: scroll;
}

.remove-button {
  background-color: rgb(219, 65, 65);
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 10px;
  margin-top: 20px;
  cursor: pointer;
  border-radius: 4px;
}

.remove-button:hover {
  background-color: rgb(160, 40, 40);
}

.remove-button-2 {
  background-color: rgb(219, 65, 65);
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 10px;
  margin-top: -10px;
  margin-bottom: 10px;
  cursor: pointer;
  border-radius: 4px;
}

.remove-button-2:hover {
  background-color: rgb(160, 40, 40);
}

.verify-button {
  background-color: rgb(65, 219, 65);
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 10px;
  margin-top: 20px;
  margin-right: 5px;
  cursor: pointer;
  border-radius: 4px;
}

.verify-button:hover {
  background-color: rgb(40, 160, 40);
}

.edit-button {
  background-color: rgb(240, 173, 28);
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 10px;
  margin-top: 20px;
  margin-right: 5px;
  cursor: pointer;
  border-radius: 4px;
}

.edit-button:hover {
  background-color: rgb(196, 142, 25);
}

.left {
  text-align: left;
  overflow: auto;
  display: block;
}

.select-box {
  width: 15vw;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
}

.scenario-box {
  border-radius: 0;
  padding: 0;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  transition: background-color 0.3s;
}

.scenario-box:hover {
  background-color: #f0f0f0;
}

.scenario-title {
  text-align: center;
  font-size: 1.2em;
}

.container-row {
  display: flex;
}

.container-row-element {
  width: 100%;
}

.container-row-element-s {
  width: 50%;
}

.container-row-element-xs {
  width: 25%;
}

</style>