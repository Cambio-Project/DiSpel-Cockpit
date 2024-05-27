<script>
import JSZip from 'jszip';
import {
  deleteScenario,
  getResult, getScenario,
  initScenario,
  startSearch,
  startSimulation, verifySearch,
  verifySimulation
} from "~/components/composables/api.js";
import {toRefinement, toScenarioEditor} from "~/components/composables/navigation.js";
import {successMessage} from "~/components/composables/popup.js";

export default {
  name: "ScenarioList",
  el: '#app',
  scenariosNew: [],
  data() {
    return {
      simID: this.$route.query.simID,
      targetLogics: ["SEL", "LTL", "MTL", "Prism", "Quantitative Prism", "TBV (untimed)", "TBV (timed)"],
      target: null,
      result: null,
      scenario: null,
    };
  },
  methods: {
    toRefinement,
    // Open the ScenarioEditor with to create a new scenario
    async openEditor() {
      const simulationID = await initScenario();
      toScenarioEditor(simulationID, this.$router);
    },
    async startSimulation(scenario) {
      await successMessage("Simulation started", 'SimID: ' + scenario.simulationID)
      scenario.simState = 'running';
      await startSimulation(scenario.simulationID);
      await successMessage("Simulation finished", 'SimID: ' + scenario.simulationID)
      scenario.simState = 'done';
      return 'done'
    },
    async startSearch(scenario) {
      await successMessage("Search started", 'SimID: ' + scenario.simulationID)
      scenario.mosimState = 'running';
      await startSearch(scenario.simulationID);
      await successMessage("Search finished", 'SimID: ' + scenario.simulationID)
      scenario.mosimState = 'done';
      return 'done'
    },
    // Open the ScenarioEditor to edit a scenario
    async editScenario(simID) {
      this.$router.push('/scenarioEditorSite/?simID=' + simID);
    },
    async updateResults() {
      this.result = await getResult(this.simID);
    },
    async complete() {
      this.$router.push('/scenariosSite');
    },
    // Remove one scenario
    async removeScenario(simulationID) {
      await deleteScenario(simulationID)
      this.$router.push('/scenariosSite');
    },
    async verifyScenario(scenario) {
      await verifySimulation(scenario);
      await this.updateResults()
    },
    async verifySearch(scenario) {
      await verifySearch(scenario);
      await this.updateResults()
    },
    mapResultToColor(result) {
      if (result === undefined) {
        return 'gray'
      }
      if (result) {
        return 'green'
      } else {
        return 'red'
      }
    },
    getSimulationVerificationResultsPerResponse(scenario, responseIndex) {
      const defaultResult = "0 / 0"
      if (this.result === undefined || this.result === null) {
        return defaultResult;
      }
      const totals = this.result.simulationResultsTotal;
      const successes = this.result.simulationResultsResponseSuccesses;
      if (totals === undefined || successes === undefined) {
        return defaultResult
      }
      return successes[responseIndex] + " / " + totals
    },
    getResilienceScore() {
      let resilienceScore = 0;
      if (this.result !== undefined && this.result !== null && this.result.resilienceScore !== undefined) {
        resilienceScore = this.result.resilienceScore
      }
      return resilienceScore
    },
    getResilienceScoreColor() {
      //value from 0 to 1
      const value = 0.1 * this.getResilienceScore()
      const hue = ((value) * 12).toString(10);
      return ["hsl(", hue, ",100%,50%)"].join("");
    },
    getSearchVerificationResultsPerResponse(scenario, responseIndex) {
      const defaultResult = "0 / 0"
      if (this.result === undefined || this.result === null) {
        return defaultResult;
      }
      const totals = this.result.searchResultsTotal;
      const successes = this.result.searchResultsResponseSuccesses;
      if (totals === undefined || successes === undefined) {
        return defaultResult
      }
      return successes[responseIndex] + " / " + totals
    },
    getSearchVerificationResultsPerScenario() {
      const defaultResult = "0 / 0"
      if (this.result === undefined || this.result === null) {
        return defaultResult;
      }
      const totals = this.result.searchResultsTotal;
      const successes = this.result.searchResultsScenarioSuccessesTotal;
      if (totals === undefined || successes === undefined) {
        return defaultResult
      }
      return successes + " / " + totals
    },
    getSimulationVerificationResultsPerScenario() {
      const defaultResult = "0 / 0"
      if (this.result === undefined || this.result === null) {
        return defaultResult;
      }
      const totals = this.result.simulationResultsTotal;
      const successes = this.result.simulationResultsScenarioSuccessesTotal;
      if (totals === undefined || successes === undefined) {
        return defaultResult
      }
      return successes + " / " + totals
    },
    //Changes all target logics to the same one
    changeAllTargets() {
      this.scenario.responses.forEach(response => {
        response.target_logic = this.target;
      });
      this.scenario.stimuli.forEach(stimulus => {
        stimulus.target_logic = this.target;
      });
    },
    //Download a single scenario as json
    async downloadJSON(simID) {
      const scenario = await getScenario(simID);

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
    this.scenario = await getScenario(this.$route.query.simID);

    this.scenario.simState = "none"
    this.scenario.mosimState = "none"

    console.log(this.scenario)
  },
};
</script>

<template>
  <div v-if="scenario">
    <!--Headline-->
    <div class="mb-2 mt-2">
      <h1 class="text-3xl">Scenario: {{ scenario.name }} </h1>

      <div class="text-gray-300">
        {{ "Scenario-ID: " + scenario.simulationID }}
      </div>

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

    <UContainer class="mb-2">
      <div>
        <button class="edit-button" @click="editScenario(scenario.simulationID)">Edit Scenario</button>
        <button class="remove-button" @click="removeScenario(scenario.simulationID)">Remove Scenario</button>
        <button class="file-download-button" @click="downloadJSON(scenario.simulationID)">Download as JSON
        </button>
      </div>
    </UContainer>

    <UContainer>
      <UCard>
        <template #header>
          <h3 class="text-2xl">Specification</h3>
        </template>

        <div class="mb-2">
          {{ "Transform all Target Logics to " }}
          <select class="select-box" @change="changeAllTargets" v-model="target">
            <option v-for="targetLogic in targetLogics" :key="targetLogic" :value="targetLogics.indexOf(targetLogic)">
              {{ targetLogic }}
            </option>
          </select>
        </div>

        <UDivider class="mb-1"></UDivider>
        <div class="left mb-2">
          <h4 class="text-mb font-bold mb-1">
            Description:
          </h4>
          {{ scenario.description }}
        </div>

        <UDivider class="mb-1"></UDivider>
        <div class="left mb-2">
          <h4 class="text-mb font-bold mb-1">
            Stimuli:
          </h4>
          <span>
                <!--{{scenario.responses[0]}}-->
                <li v-for="(stimulus, index) in scenario.stimuli" :key="stimulus" class="left">
                {{ index + 1 }}.
                  <!--
<select v-model="stimulus.target_logic" class="select-box">
  <option v-for="targetLogic in targetLogics" :key="targetLogic"
          :value="targetLogics.indexOf(targetLogic)">{{ targetLogic }}</option>
</select>
-->
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

                <div>
                <i class="sel-line"> <strong>SEL:</strong> {{ stimulus.SEL }} </i>
                </div>
            </li>
              </span>
        </div>

        <UDivider class="mb-1"></UDivider>
        <div class="left mb-2">
          <h4 class="text-mb font-bold mb-1">
            Environment:
          </h4>

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
          <div class="left">
            - Search Window Size: {{ scenario.searchWindowSize }}
          </div>
        </div>

        <UDivider class="mb-1"></UDivider>
        <h4 class="left text-mb font-bold mb-1">
          Responses:
        </h4>

        <span>
                <!--{{scenario.responses[0]}}-->
                <li v-for="(response, index) in scenario.responses" :key="response" class="left">
                {{ index + 1 }}.
                  <!--<select v-model="response.target_logic" class="select-box">
                    <option v-for="targetLogic in targetLogics" :key="targetLogic"
                            :value="targetLogics.indexOf(targetLogic)">{{ targetLogic }}</option>
                  </select>-->
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

                  <div>
                  <i class="sel-line"> <strong>SEL:</strong> {{ response.SEL }} </i>
                  <br>

                </div>

                </li>
                </span>
      </UCard>
    </UContainer>

    <br/>

    <UContainer>
      <UCard>
        <template #header>
          <h3 class="text-2xl">Results</h3>
        </template>

        <div class="left mb-4 container-row">
          <UContainer style="width:100%;">
            <h4 class="text-mb font-bold mb-1 text-center">
              Resilience Score:
            </h4>
            <UCard :style="{ 'background-color': getResilienceScoreColor(scenario)}"
                   class='text-center text-2xl font-bold'>
              <span>
                    {{ getResilienceScore() }}
              </span>
            </UCard>
          </UContainer>

          <UContainer style="width:100%;">
            <h4 class="text-mb font-bold mb-1 text-center">
              Simulation:
            </h4>
            <UCard class='text-center text-2xl font-bold'>
              <span>
                    {{ getSimulationVerificationResultsPerScenario() }}
              </span>
            </UCard>
          </UContainer>

          <UContainer style="width:100%;">
            <h4 class="text-mb font-bold mb-1 text-center">
              Monitoring:
            </h4>
            <UCard class='text-center text-2xl font-bold'>
              <span>
                    {{ getSearchVerificationResultsPerScenario() }}
              </span>
            </UCard>
          </UContainer>
        </div>

        <UContainer class="mb-4">
          <UButton class="ml-2" v-if="scenario.simState === 'none'"
                   @click="startSimulation(scenario);">
            Start Simulation
          </UButton>

          <UButton class="ml-2" v-if="scenario.mosimState === 'none'"
                   @click="startSearch(scenario);">
            Start Search
          </UButton>
          <UButton class="verify-button ml-2" @click="verifyScenario(scenario);">Verify Simulation</UButton>
          <UButton class="verify-button ml-2" @click="verifySearch(scenario);">Verify Monitoring</UButton>

          <div v-if="scenario.simState === 'running'">
            <br/>
            <UProgress animation="carousel"></UProgress>
            <p>Simulation is running</p>
          </div>
          <div v-if="scenario.simState === 'done'">
            <br/>
            <p>Simulation is Done, you can now start the verify process</p>
          </div>
          <div v-if="scenario.mosimState === 'running'">
            <br/>
            <UProgress animation="carousel"></UProgress>
            <p>Search is running</p>
          </div>
          <div v-if="scenario.mosimState === 'done'">
            <br/>
            <p>Search is Done, you can now start the verify process</p>
          </div>
        </UContainer>

        <div v-if="result !== null">
          <UDivider label="Simulation"></UDivider>
          <ul>
            <li v-for="(resultName,resultIndex) in result.simulationNames" class="list-item">
              <UCard>
                <template #header class="font-bold">
                  {{ resultName }}
                </template>


                <li v-for="(response, index) in scenario.responses" :key="response" class="left container-row">
                  <div>
                    <UTooltip text="Please verify before Refinement!">
                      <button @click="toRefinement(scenario.simulationID, index)" class="refine-button">Refine
                        Response
                      </button>
                    </UTooltip>
                    <br><br>
                  </div>
                  <div>
                    {{ index + 1 }}.
                    <i class="sel-line"
                       :style="{'color': mapResultToColor(result.simulationResults[resultIndex][index])}">
                      <strong>SEL:</strong> {{ response.SEL }} </i>
                    <br>
                  </div>

                </li>

              </UCard>
            </li>
          </ul>

          <UDivider label="Monitoring"></UDivider>
          <ul>
            <li v-for="(resultName,resultIndex) in result.searchNames" class="list-item">
              <UCard>
                <template #header class="font-bold">
                  {{ resultName }}
                </template>


                <li v-for="(response, index) in scenario.responses" :key="response" class="left container-row">
                  <div>
                    <UTooltip text="Please verify before Refinement!">
                      <button @click="toRefinement(scenario.simulationID, index)" class="refine-button">Refine
                        Response
                      </button>
                    </UTooltip>
                    <br><br>
                  </div>
                  <div>
                    {{ index + 1 }}.
                    <i class="sel-line" :style="{'color': mapResultToColor(result.searchResults[resultIndex][index])}">
                      <strong>SEL:</strong> {{ response.SEL }} </i>
                    <br>
                  </div>

                </li>

              </UCard>
            </li>
          </ul>
        </div>
      </UCard>

    </UContainer>

    <!--Mainframe-->
    <div>
      <!--Tools-->
      <div>

      </div>

      <!--Scenario List-->

    </div>
  </div>

  <div class="mt-2">
    <UButton @click="complete">Complete</UButton>
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
  margin: 0px 5px 5px;
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

.refine-button {
  background-color: rgb(65, 219, 65);
  border: none;
  color: white;
  padding: 5px 10px;
  margin-right: 5px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 10px;
  cursor: pointer;
  border-radius: 4px;
}

.verify-button {
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
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.container-row {
  display: flex;
  padding: 5px;
}

.select-box {
  width: 15vw;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
}

</style>