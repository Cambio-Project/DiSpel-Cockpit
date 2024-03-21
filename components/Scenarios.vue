<script>
import JSZip from 'jszip';

export default {
  name: "ScenarioList",
  el: '#app',
  scenariosNew: [],
  data() {
    return{
      targetLogics: ["SEL", "LTL", "MTL", "Prism", "Quantitative Prism", "TBV (untimed)", "TBV (timed)"],
      target: null,
      verificationResults: {},
      scenarios : null,
      popUp: null,
  };
},
  methods:{
    // open the ScenarioEditor with to create a new scenario
    async openEditor() {
      const res = await fetch("/api/initScenario", {
      method: "POST"
      })
    const body = await res.json()
    console.log(body)

    this.$router.push('/scenarioEditorSite/?simID='+ body.simulationID);
    },
    // starts the MiSim simulation
    async startSimulation(simulationID, scenario) {

      this.popUp.add({
        title: 'Simulation Started',
        description: 'SimID: '+scenario.simulationID});
      scenario.simState = 'running';

      const res = await fetch("/api/startSimulation", {
        method: "POST",
        body: JSON.stringify({
          simulationID: simulationID
        })
      })
      const body = await res.json();
      scenario.simState = 'done';

      console.log("MiSim Response for simulationID: " + simulationID + ": ", body)

      return 'done'
    },
    // open the ScenarioEditor to edit a scenario
    async editScenario(simID) {
      this.$router.push('/scenarioEditorSite/?simID='+ simID);
    },
    // remove one scenario from the Scenario MongoDB table
    async removeScenario(ID) {
      const res = await fetch("/api/deleteScenario", {
        method: "POST",
        body: JSON.stringify({
          ID: ID
        })
      })
      const body = await res.json();
      console.log(body);

      const response = await fetch("/api/allScenarios");
      const bodyScenarios = await response.json();
      this.scenarios = bodyScenarios.scenarios
    },
    // verify the simulation
    async verifyScenario(scenario) {
      const response = await useFetch("/api/verifySimulation", {
        method: "POST",
        body: JSON.stringify({
          scenario,
        })
      });
      const responsePayload = response.data.value.result;
      this.verificationResults[scenario._id] = responsePayload;
    },
    // get the text color for the verifcation
    getVerificationTextColor(scenario, responseIndex) {
      const verificationResult = this.verificationResults[scenario._id];
      if(verificationResult) {
        if(verificationResult[responseIndex]) {
          return 'green';
        } else {
          return 'red';
        }
      } else {
        return 'gray';
      }
      //return verificationResult ? verificationResult[responseIndex] : null;
    },
    // open the refinement page
    openRefinement(simID, responseIndex) {
			this.$router.push('/tqPropRefinerSiteDynamic?sim_id=' + simID + '&response_index=' + responseIndex);
		},
    // changes all target logics to the same one
    changeAllTargets() {
      this.scenarios.forEach(scenario => {
      scenario.responses.forEach(response => {
          response.target_logic= this.target;
      })
    });
    },
    // download a single scenario as json
    async downloadJSON(simID) {
      const res = await fetch("/api/getScenario", {
        method: "POST",
        body: JSON.stringify({
          simulationID: simID
        })
      })
      const body = await res.json()
      var scenario = body.Scenario

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
    // download all scenarios as zip file
    async downloadZip() {
      const zip = new JSZip();
      var c = 1
      this.scenarios.forEach((scenario, index) => {
        var name = c + " - " + scenario.name;
        const jsonData = this.scenarios[index];
        zip.file('Scenario_' + name + '.json', JSON.stringify(jsonData, null, 2));
        c++;
      });

      const content = await zip.generateAsync({ type: 'blob' });
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
  // gets executed on pageload
  async beforeMount() {
    // get all scenarios from the Scenario MongoDB table
    const response = await fetch("/api/allScenarios");
    const body = await response.json();
    this.scenarios = body.scenarios

    // set the simulation state of every scenario to "none"
    for (let i = 0; i < this.scenarios.length; i++) {
      this.scenarios[i].simState = "none"
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

      <div class="mb-4">
        <UButton class="mr-4" @click="openEditor">New Scenario</UButton>
        <UButton @click="downloadZip(index)">Download all Scenarios</UButton>
      </div>

      <div>
        {{ "Transform all Target Logics to " }}
        <select class="select-box" @change="changeAllTargets" v-model="target">
            <option v-for="targetLogic in targetLogics" :key="targetLogic" :value="targetLogics.indexOf(targetLogic)">{{ targetLogic }}</option>
        </select>
      </div>

    </div>
    
    <!--Scenario List-->
    
      <div class="list-container">
        <div class="list-content">
          <div v-if="scenarios">
            <ul>

            <li v-for="(scenario, index) in scenarios" class="list-item">

              <h3 class="text-2xl">Name: {{scenario.name}} </h3>

              <UBadge v-if="scenario.category === 'None' " color="gray">
                {{ 'None category defined' }}
              </UBadge>

              <UBadge v-if="scenario.category === 'Exploratory' " color="purple">
                {{ 'Exploratory' }}
             </UBadge>

             <UBadge v-if="scenario.category === 'Growth' " color="blue">
                {{ 'Growth' }}
              </UBadge>

              <UBadge v-if="scenario.category === 'UseCase' " color="yellow">
                {{ 'Use Case' }}
              </UBadge>


              <div class="left mb-8">
                <h4  class="text-mb font-bold mb-1" >
                  Description:
                </h4>
                {{ scenario.description }}
              </div>



              <div class="left mb-8">
                <h4 class="text-mb font-bold mb-1">
                  Stimuli:
                </h4>

                <ul>
                  <li v-for="stimuli in scenario.stimuli">
                    - {{Object.keys(stimuli)[0]}}
                  </li>
                </ul>
              </div>


              
                <h4 class="left text-mb font-bold mb-1">
                 Responses:
                </h4 >

              <span>
                <!--{{scenario.responses[0]}}-->
                <li v-for="(response, index) in scenario.responses" :key="response"  :style="{ color: getVerificationTextColor(scenario, index)}" class="left">
                {{ index +1}}.
                <select v-model="response.target_logic" class="select-box">
                  <option v-for="targetLogic in targetLogics" :key="targetLogic" :value="targetLogics.indexOf(targetLogic)">{{ targetLogic }}</option>
                </select>

                <span v-if="response.target_logic==0">
                  {{ response.SEL}}
                </span>
                <span v-if="response.target_logic==1">
                  {{ response.LTL}}
                </span>
                <span v-if="response.target_logic==2">
                  {{ response.MTL}}
                </span>
                <span v-if="response.target_logic==3">
                  {{ response.Prism}}
                </span>
                <span v-if="response.target_logic==4">
                  {{ response.Quantitative_Prism}}
                </span>
                <span v-if="response.target_logic==5">
                  {{ response.TBV_untimed}}
                </span>
                <span v-if="response.target_logic==6">
                  {{ response.TBV_timed}}
                </span>
                
                <div>
                <i class="sel-line"> <strong>SEL:</strong> {{ response.SEL }} </i>
                <br>
                  <UTooltip text="Please verify before Refinement!">
                      <button @click="openRefinement(scenario.simulationID, index)" class="verify-button" :style="{ 'background-color': getVerificationTextColor(scenario, index) }">Refine Response</button>
                  </UTooltip>
                <br><br>
              </div>

              </li>
              </span>

              <div>
                <UButton v-if="scenario.simState === 'none'" @click="startSimulation(scenario.simulationID, scenario);">Start Simulation</UButton>
                <div v-if="scenario.simState === 'running'">
                  <UProgress animation="carousel"></UProgress>
                  <p>Simulation is running</p>
                </div>
                <div v-if="scenario.simState === 'done'">
                  <p>Simulation is Done, you can now start the verify process</p>
                </div>
              </div>

              <div class="text-gray-300">
                {{"SimulationID: " + scenario.simulationID }}
              </div>

              <div>
                <button class="verify-button" @click="verifyScenario(scenario)">Verify Scenario</button>
                <button class="edit-button" @click="editScenario(scenario.simulationID)">Edit Scenario</button>
                <button class="remove-button" @click="removeScenario(scenario._id)">Remove Scenario</button>
                <button class="file-download-button" @click="downloadJSON(scenario.simulationID)">Download as JSON</button>
              </div>

              </li>
            </ul>
          </div>
        </div>
      </div>
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
  margin: 5px;
  margin-top: 20px;
  cursor: pointer;
  border-radius: 4px;
}

.file-download-button:hover {
  background-color: #9bb8d3;
}

.sel-line {
  margin: 0.8vw;
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

.left{
  text-align: left;
  overflow: auto;
  display: block;
}

.select-box {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>