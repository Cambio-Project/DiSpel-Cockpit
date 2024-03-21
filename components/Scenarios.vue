<script>
import JSZip from 'jszip';
import {tryCatch} from "standard-as-callback/built/utils.js";

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
    tryCatch() {
      return tryCatch
    },
    // Open the ScenarioEditor with to create a new scenario
    async openEditor() {
      const res = await fetch("/api/initScenario", {
      method: "POST"
      })
    const body = await res.json()
    console.log(body)

    this.$router.push('/scenarioEditorSite/?simID='+ body.simulationID);
    },
    async startSimulation(simulationID) {
      const res = await fetch("/api/startSimulation", {
        method: "POST",
        body: JSON.stringify({
          simulationID: simulationID
        })
      })
      const body = await res.json();
      console.log(body.status);
      return 'done'
    },
    // Open the ScenarioEditor to edit a scenario
    async editScenario(simID) {
      this.$router.push('/scenarioEditorSite/?simID='+ simID);
    },
    // Remove one scenario
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
    getVerificationTextColor(scenario, responseIndex) {
      const verificationResult = this.verificationResults[scenario._id];
      if(verificationResult) {
        if(verificationResult[responseIndex]) {
          return 'green';
        } else {
          return 'red';
        }
      } else {
        return 'black';
      }
      //return verificationResult ? verificationResult[responseIndex] : null;
    },
    openRefinement(simID, responseIndex) {
			this.$router.push('/tqPropRefinerSiteDynamic?sim_id=' + simID + '&response_index=' + responseIndex);
		},
    //Changes all target logics to the same one
    changeAllTargets() {
      this.scenarios.forEach(scenario => {
      scenario.responses.forEach(response => {
          response.target_logic= this.target;
      })
    });
    },
    //Download a single scenario as json
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
    //Download all scenarios as zip file
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
  async beforeMount() {
    const response = await fetch("/api/allScenarios");
    const body = await response.json();
    this.scenarios = body.scenarios

    for (let i = 0; i < this.scenarios.length; i++) {
      this.scenarios[i].simState = "none"
    }

    this.popUp = useToast()

    console.log(this.scenarios)
  },
  // async mounted() {
  //   const res = await fetch("/api/allScenarios")
  //   this.scenariosNew = await res.json();
  //   console.log(this.scenariosNew)
  // },
};
</script>

<template>
  <!--Headline-->
  <div>
    <h1> Scenarios </h1>
  </div>

  <!--Mainframe-->
  <div>
    <!--Tools-->
    <div>

      <div> 
        <UButton @click="openEditor">New Scenario</UButton>
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

              <h3>Index: {{index}} Name: {{scenario.name}} </h3>

              <div v-if="scenario.category === 'None' " class="category-frame-0">
                {{ 'None' }}
              </div>

              <div v-if="scenario.category === 'Exploratory' " class="category-frame-1">
                {{ 'Exploratory' }}
             </div>

             <div v-if="scenario.category === 'Growth' " class="category-frame-2">
                {{ 'Growth' }}
              </div>

              <div v-if="scenario.category === 'UseCase' " class="category-frame-3">
                {{ 'Use Case' }}
              </div>

              <div>
                {{"SimulationID: " + scenario.simulationID }}
              </div>

              <div>
                {{ scenario.description }}
              </div>

              <div>
                <UButton @click="
                    startSimulation(scenario.simulationID);
                    this.popUp.add({
                      title: 'Simulation Started',
                      description: 'SimID: '+scenario.simulationID});
                    scenario.simState = 'running';">
                  Start Simulation
                </UButton>
                <UProgress v-if="scenario.simState === 'running'" animation="carousel"></UProgress>
              </div>

              
              {{scenario.simState}}

              <h4 class="left">
                Stimuli:
              </h4>

              <ul>
                <li v-for="stimuli in scenario.stimuli">
                  {{Object.keys(stimuli)[0]}}
                </li>
              </ul>

              
                <h4 class="left">
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
                <button @click="openRefinement(scenario.simulationID, index)" class="verify-button" :style="{ 'background-color': getVerificationTextColor(scenario, index) }">Refine Response</button>
                <br><br>
              </div>

              </li>
              </span>

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
     {{test}}
  </div>
</template>


<style scoped>

.headline-frame {
  background-color: #eaf6ff; 
  padding: 0px; 
  display:flex;
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
  justify-content:center; 
  align-items:center; 
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
  margin: 5px;
  margin-top: 20px;
  cursor: pointer;
  border-radius: 4px;
}

.file-download-button:hover {
  background-color: #9bb8d3;
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