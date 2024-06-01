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
      await verifySimulation(scenario);
      await this.updateResults()
    },
    async verifySearch(scenario) {
      await verifySearch(scenario);
      await this.updateResults()
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
        <button class="edit-button" @click="toScenarioEditor(scenario.simulationID)">Edit Scenario</button>
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
          <select class="select-box" @change="changeAllTargets([this.scenario],this.target)" v-model="target">
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
            <ul>
                <li v-for="(stimulus, index) in scenario.stimuli" :key="stimulus" class="left">
                {{ index + 1 }}.
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
              </ul>
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
          <ul>
                <li v-for="(response, index) in scenario.responses" :key="response" class="left">
                {{ index + 1 }}.
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
            </ul>
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
            <UCard :style="{ 'background-color': getResilienceScoreColor(this.result)}"
                   class='text-center text-2xl font-bold'>
              <span>
                    {{ getResilienceScore(this.result) }}
              </span>
            </UCard>
          </UContainer>

          <UContainer style="width:100%;">
            <h4 class="text-mb font-bold mb-1 text-center">
              Simulation:
            </h4>
            <UCard class='text-center text-2xl font-bold'>
              <span>
                    {{ getSimulationVerificationResultsPerScenario(this.result) }}
              </span>
            </UCard>
          </UContainer>

          <UContainer style="width:100%;">
            <h4 class="text-mb font-bold mb-1 text-center">
              Monitoring:
            </h4>
            <UCard class='text-center text-2xl font-bold'>
              <span>
                    {{ getSearchVerificationResultsPerScenario(this.result) }}
              </span>
            </UCard>
          </UContainer>
        </div>

        <UContainer class="mb-4">
          <UButton class="ml-2" v-if="scenario.simState === 'none'"
                   @click="startScenarioSimulation(scenario);">
            Start Simulation
          </UButton>

          <UButton class="ml-2" v-if="scenario.mosimState === 'none'"
                   @click="startScenarioSearch(scenario);">
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
                  <UButton class="mr-1" icon="i-heroicons-trash-16-solid" square size="xs" color="red"
                           @click="deleteResult('simulation', scenario.simulationID, resultName, resultIndex);this.updateResults();"></UButton>
                </template>


                <li v-for="(response, index) in scenario.responses" :key="response" class="left container-row">
                  <div>
                    <UTooltip text="Please verify before Refinement!">
                      <button @click="toRefinement(scenario.simulationID, index, resultName, true)"
                              class="refine-button">Refine
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
                  <UButton class="mr-1" icon="i-heroicons-trash-16-solid" square size="xs" color="red"
                           @click="deleteResult('search', scenario.simulationID, resultName, resultIndex);this.updateResults();"></UButton>
                </template>


                <li v-for="(response, index) in scenario.responses" :key="response" class="left container-row">
                  <div>
                    <UTooltip text="Please verify before Refinement!">
                      <button @click="toRefinement(scenario.simulationID, index, resultName, false)"
                              class="refine-button">Refine
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

  </div>

  <div class="mt-2">
    <UButton @click="toScenariosOverview()">Complete</UButton>
  </div>
</template>


<style scoped>

.file-download-button {
  background-color: #aacbe9;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 10px;
  margin: 0 5px 5px;
  cursor: pointer;
  border-radius: 4px;
}

.file-download-button:hover {
  background-color: #9bb8d3;
}

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

.list-item {
  transition: background-color 0.3s;
  border-bottom: 2px solid #ccc;
  padding: 32px;
  display: block;
}

.list-item:hover {
  background-color: #f0f0f0;
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