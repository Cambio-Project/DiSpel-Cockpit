<script>

import * as domain from "domain";
import {
  deleteResultEntry,
  deleteScenarioField,
  getScenario, pushScenarioField, setScenarioField,
  uploadAdditionalEnvironmentFile
} from "~/components/composables/api.js";

export default {
  computed: {
    domain() {
      return domain
    }
  },
  data() {
    return {
      categories: ["None", "UseCase", "Growth", "Exploratory"],
      targetLogics: ["SEL", "LTL", "MTL", "Prism", "Quantitative Prism", "TBV (untimed)", "TBV (timed)"],
      target: null,

      simID: this.$route.query.simID,
      name: null,
      category: "None",
      description: null,
      stimuli: null,
      environmentArchitecture: null,
      environmentExperiment: null,
      environmentLoad: null,
      environmentMonitoringData: null,
      responses: null,
      searchWindowSize: null,

      importErrorMessage: null,
      componentKey: 0,
    }
  },
  methods: {
    // get fields from DB object with simulationID
    async initFields() {
      const scenario = await getScenario(this.simID);

      if (typeof scenario.name !== "undefined") {
        this.name = scenario.name
      }
      if (typeof scenario.category !== "undefined") {
        this.category = scenario.category
      }
      if (typeof scenario.description !== "undefined") {
        this.description = scenario.description
      }
      if (typeof scenario.stimuli !== "undefined") {
        this.stimuli = scenario.stimuli
      }
      if (typeof scenario.environment.architecture !== "undefined") {
        this.environmentArchitecture = scenario.environment.architecture
      }
      if (typeof scenario.environment.experiment !== "undefined") {
        this.environmentExperiment = scenario.environment.experiment
      }
      if (typeof scenario.environment.load !== "undefined") {
        this.environmentLoad = scenario.environment.load
      }
      if (typeof scenario.environment.monitoringData !== "undefined") {
        this.environmentMonitoringData = scenario.environment.monitoringData
      }
      if (typeof scenario.searchWindowSize !== "undefined") {
        this.searchWindowSize = scenario.searchWindowSize
      }
      if (typeof scenario.responses !== "undefined") {
        this.responses = scenario.responses
      }
    },
    // create response with pspwizard
    openPSPResponse() {
      this.$router.push('/pspwizardSite?simID=' + this.simID + '&type=response');
    },
    openPSPStimulus() {
      this.$router.push('/pspwizardSite?simID=' + this.simID + '&type=stimulus');
    },
    // remove stimulus
    removeStimulus(index) {
      this.deleteField("stimuli", index)
    },
    // remove architecture
    removeEnvironmentArchitecture(index) {
      this.deleteField("environment.architecture", index)
    },
    // remove experiment
    removeEnvironmentExperiment(index) {
      this.deleteField("environment.experiment", index)
    },
    // remove load
    removeEnvironmentLoad(index) {
      this.deleteField("environment.load", index)
    },
    // remove monitoring data
    removeEnvironmentMonitoringData(index) {
      this.deleteField("environment.monitoringData", index)
    },
    // remove response
    removeResponse(index) {
      this.deleteField("responses", index)
      this.deleteResultField(index)
    },
    async deleteField(fieldName, index) {
      await deleteScenarioField(this.simID, fieldName, index);
      await this.initFields();
    },
    async deleteResultField(index) {
      await deleteResultEntry(this.simID, index);
    },
    // add scenario with metadata and stimuli and responses
    async complete() {
      this.$router.push('/scenariosSite');
    },
    //Changes all target logics to the same one
    changeAllTargets() {
      this.responses.forEach(response => {
        response.target_logic = this.target;
      })
      this.stimuli.forEach(stimulus => {
        stimulus.target_logic = this.target;
      })
    },
    uploadStimuli(type) {
      const fileInput = this.$refs.fileInputStimulus;
      this.stimuli = []
      this.upload(type, fileInput)
    },
    uploadArchitecture(type) {
      const fileInput = this.$refs.fileInputEnvironmentArchitecture;
      this.environmentArchitecture = []
      this.upload(type, fileInput)
    },
    uploadExperiment(type) {
      const fileInput = this.$refs.fileInputEnvironmentExperiment;
      this.environmentExperiment = []
      this.upload(type, fileInput)
    },
    uploadLoad(type) {
      const fileInput = this.$refs.fileInputEnvironmentLoad;
      this.environmentLoad = []
      this.upload(type, fileInput)
    },
    uploadMonitoringData(type) {
      const fileInput = this.$refs.fileInputEnvironmentMonitoringData;
      this.environmentMonitoringData = []
      this.upload(type, fileInput)
    },
    async upload(type, fileInput) {
      this.loadedFiles = []
      console.log("HERE")
      console.log(fileInput)
      for (const file of fileInput.files) {
        const filename = file.name
        if (filename.split(".").pop() === "json") {
          const jsonAsText = await file.text()
          const json = JSON.parse(jsonAsText)
          const tmp = {
            [filename]: json
          }
          await this.addValue(type, tmp)

        } else {
          await uploadAdditionalEnvironmentFile(filename, file);
          const tmp = {
            [filename]: "external"
          }
          await this.addValue(type, tmp)
        }
        this.loadedFiles.push(filename)
      }
      await this.initFields()
      location.reload();
    },
    //imports a scenario
    async handleFileChange() {
      const fileInput = this.$refs.fileInput;

      if (!fileInput.files.length) {
        console.warn('No file selected');
        return;
      }

      const file = fileInput.files[0];
      const fileReader = new FileReader();

      fileReader.onload = () => {
        try {
          const jsonData = JSON.parse(fileReader.result);
          this.jsonData = JSON.stringify(jsonData, null, 2);

          console.log(jsonData);

          // check if at least one field for a scenario is available
          if (jsonData.name == null && jsonData.category == null && jsonData.description == null && jsonData.stimuli == null && jsonData.environment.architecture == null && jsonData.environment.experiment == null && jsonData.environment.load == null && jsonData.responses == null) {
            this.importErrorMessage = "The imported scenario has no valid field. Define either one or more of the fields name, category, description, stimuli, environment and responses.";
            return;
          }

          // reset all fields
          this.resetAllFields();

          // name
          if (jsonData.name != null) {
            this.name = jsonData.name;
            this.setValue("name", this.name)
          }

          // category
          if (jsonData.category != null) {
            this.category = jsonData.category;
            this.setValue("category", this.category)
          }

          // description
          if (jsonData.description != null) {
            this.description = jsonData.description;
            this.setValue("description", this.description)
          }

          // search window size
          if (jsonData.searchWindowSize != null) {
            this.searchWindowSize = jsonData.searchWindowSize;
            this.setValue("searchWindowSize", this.searchWindowSize)
          }

          // stimuli
          this.stimuli = []
          if (jsonData.stimuli != null) {
            jsonData.stimuli.forEach(element => {
              this.stimuli.push(element);
            });
            this.setValue("stimuli", this.stimuli)
          } else {
            this.setValue("stimuli", [])
          }

          // environment architecture
          this.environmentArchitecture = []
          if (jsonData.environment.architecture != null) {
            jsonData.environment.architecture.forEach(element => {
              this.environmentArchitecture.push(element);
            });
            this.setValue("environment.architecture", this.environmentArchitecture)
          } else {
            this.setValue("environment.architecture", [])
          }

          // environment experiment
          this.environmentExperiment = []
          if (jsonData.environment.experiment != null) {
            jsonData.environment.experiment.forEach(element => {
              this.environmentExperiment.push(element);
            });
            this.setValue("environment.experiment", this.environmentExperiment)
          } else {
            this.setValue("environment.experiment", [])
          }

          // environment load
          this.environmentLoad = []
          if (jsonData.environment.load != null) {
            jsonData.environment.load.forEach(element => {
              this.environmentLoad.push(element);
            });
            this.setValue("environment.load", this.environmentLoad)
          } else {
            this.setValue("environment.load", [])
          }

          // response
          this.responses = []
          if (jsonData.responses != null) {
            jsonData.responses.forEach(element => {
              this.responses.push(element);
            });
            this.setValue("responses", this.responses)
          } else {
            this.setValue("responses", [])
          }
          this.initFields()

          this.importErrorMessage = null

          //TODO rerendering doesn't help
          //setTimeout(this.forceRerender,1000)
          //TODO reloading the page works, but isn't pretty
          setTimeout(() => {
            location.reload();
          }, 500);

        } catch (error) {
          // mapping not valid
          this.importErrorMessage = "The imported scenario is not valid! Technical error message: \n " + error
          console.error('Error parsing JSON:', error);
        }
      };

      fileReader.readAsText(file);
    },
    resetAllFields() {
      this.outputType = null
      this.target = null
      this.name = ""
      this.category = "None"
      this.description = null
      this.stimuli = null
      this.environmentArchitecture = null
      this.environmentExperiment = null
      this.environmentLoad = null
      this.environmentMonitoringData = null
      this.searchWindowSize = null
      this.responses = null
      this.showTooltip = false
    },
    async addValue(field, newValue) {
      await pushScenarioField(this.simID, field, newValue)
    },
    async setValue(field, newValue) {
      await setScenarioField(this.simID, field, newValue);
    },
    forceRerender() {
      this.componentKey += 1;
      console.log("Rerendering!")
    },
  },
  beforeMount() {
    this.initFields();
  },
  watch: {
    name(newName) {
      this.addValue("name", newName)
    },
    category(newCategory) {
      this.addValue("category", newCategory)
    },
    description(newDescription) {
      this.addValue("description", newDescription)
    },
    searchWindowSize(newSearchWindowSize) {
      this.addValue("searchWindowSize", newSearchWindowSize)
    }
  },
}


</script>

<script setup>
const config = useRuntimeConfig()
const domain = "http://" + config.public.miSimDomain + ":" + config.public.miSimPort + "/simulate/upload"

</script>

<template :key="componentKey">
  <!--Headline-->
  <div>
    <h1 class="text-3xl mt-2"> Scenario Editor </h1>
  </div>

  <!--Main Frame-->
  <div>
    <!--       <div v-if="this.importErrorMessage">-->
    <!--          <pre class="import-error-text">{{ this.importErrorMessage }}</pre>-->
    <!--        </div>-->

    <h3 class="center">

      <input v-model="name" type="text" placeholder="Enter scenario name"
             class="small-text-field p-1 border-2 rounded-xl"/>
      Category:
      <select v-model="category" class="select-box">
        <option v-for="category in categories" :key="category">{{ category }}</option>
      </select>

      <div class="file-upload-label" style="margin-left: 0.6vw;">
        <label for="fileInput" class="custom-file-upload">Import Scenario</label>
        <input class="bg-gray-500" id="fileInput" type="file" ref="fileInput" @change="handleFileChange"
               style="display: none;">
      </div>
    </h3>

    <textarea v-model="description" type="text" placeholder="Enter description"
              class="larger-text-field p-1 border-2 rounded-xl"/>

    <div>
      {{ "Transform all Target Logics to " }}
      <select class="select-box fw" @change="changeAllTargets" v-model="target">
        <option v-for="targetLogic in targetLogics" :key="targetLogic" :value="targetLogics.indexOf(targetLogic)">
          {{ targetLogic }}
        </option>
      </select>
    </div>

    <div class="message-container">

      <p>Stimuli:</p>
      <li v-for="(stimulus, index) in stimuli" :key="stimulus" class="left">
        {{ index + 1 }}.
        <select v-model="stimulus.target_logic" class="select-box">
          <option v-for="targetLogic in targetLogics" :key="targetLogic" :value="targetLogics.indexOf(targetLogic)">
            {{ targetLogic }}
          </option>
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

        <button class="remove-button" @click="removeStimulus(index)">Remove</button>
        <br>
        <i class="sel-line"> <strong>SEL:</strong> {{ stimulus.SEL }} </i> <br> <br>

      </li>

      <UButton @click="openPSPStimulus">Add Stimulus</UButton>
    </div>

    <div class="message-container">

      <p>Environment:</p>

      <UDivider></UDivider>
      <p>Architecture:</p>
      <input class="custom-file-input" id="fileInput" type="file"
             ref="fileInputEnvironmentArchitecture" @change="uploadArchitecture('environment.architecture')">

      <ul>
        <li v-for="(file, index) in environmentArchitecture">
          {{ Object.keys(file) }}
          <button class="remove-button" @click="removeEnvironmentArchitecture(index)">Remove</button>
          <br>
        </li>
      </ul>

      <UDivider></UDivider>
      <p>Experiment:</p>
      <input class="custom-file-input" id="fileInput" type="file"
             ref="fileInputEnvironmentExperiment" @change="uploadExperiment('environment.experiment')">

      <ul>
        <li v-for="(file, index) in environmentExperiment">
          {{ Object.keys(file) }}
          <button class="remove-button" @click="removeEnvironmentExperiment(index)">Remove</button>
          <br>
        </li>
      </ul>

      <UDivider></UDivider>
      <p>Load:</p>
      <input class="custom-file-input" id="fileInput" type="file"
             ref="fileInputEnvironmentLoad" @change="uploadLoad('environment.load')" multiple="multiple">

      <ul>
        <li v-for="(file, index) in environmentLoad">
          {{ Object.keys(file) }}
          <button class="remove-button" @click="removeEnvironmentLoad(index)">Remove</button>
          <br>
        </li>
      </ul>

      <UDivider></UDivider>
      <p>Monitoring Data:</p>
      <input class="custom-file-input" id="fileInput" type="file"
             ref="fileInputEnvironmentMonitoringData" @change="uploadMonitoringData('environment.monitoringData')">

      <ul>
        <li v-for="(file, index) in environmentMonitoringData">
          {{ Object.keys(file) }}
          <button class="remove-button" @click="removeEnvironmentMonitoringData(index)">Remove</button>
          <br>
        </li>
      </ul>

      <UDivider></UDivider>
      <p>Search Window Size:</p>
      <textarea v-model="searchWindowSize" type="text" placeholder="Enter Search Window Size"
                class="p-1 border-2 rounded-xl"/>

    </div>

    <div class="message-container">
      <p class="mb-2">Responses:</p>
      <li v-for="(response, index) in responses" :key="response" class="left">
        {{ index + 1 }}.
        <select v-model="response.target_logic" class="select-box">
          <option v-for="targetLogic in targetLogics" :key="targetLogic" :value="targetLogics.indexOf(targetLogic)">
            {{ targetLogic }}
          </option>
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

        <button class="remove-button" @click="removeResponse(index)">Remove</button>
        <br>
        <i class="sel-line"> <strong>SEL:</strong> {{ response.SEL }} </i> <br> <br>

      </li>

      <UButton @click="openPSPResponse">Add Response</UButton>

    </div>

    <div class="mt-2">
      <!-- TODO: add stimulus check again as soon as supported -->
      <div v-if="name !== null && responses != null">
        <UButton @click="complete">Complete</UButton>
      </div>

      <div v-else>
        <div>
          <UTooltip text="Minimum: Name and 1 Response!">
            <UButton color="gray" @mouseover="showTooltip = true" @mouseleave="showTooltip = false">Complete</UButton>
          </UTooltip>
        </div>
      </div>
    </div>
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

.box-frame {
  background-color: #d3d3d3;
  justify-content: center;
  align-items: center;
  display: block;
  height: 87vh;
  width: 100%;
  margin-top: -22px;
}

.center {
  align-items: center;
  justify-content: center;
}

.file-upload-label {
  background-color: #aacbe9;
  border: none;
  color: white;
  padding: 0.5vh 0.5vh;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  font-weight: normal;
  margin: 20px 2px 2px;
  border-radius: 4px;
}

.file-upload-label:hover {
  background-color: #9bb8d3;
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
  cursor: pointer;
  border-radius: 4px;
  margin-top: -1vh;
}

.new-button:hover {
  background-color: rgb(73, 167, 61);
}

.not-ready-button {
  background-color: rgb(114, 214, 101);
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin-top: -1vh;
  border-radius: 4px;
  opacity: 70%
}

.not-ready-button:hover .info-text {
  display: block;
}

.info {
  transform: translateX(0vh);
  color: #999;
}

.info-text {
  position: absolute;
  top: 20%;
  right: 20%;
  padding: 8px;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 4px;
  z-index: 1;
}

.remove-button {
  background-color: rgb(219, 65, 65);
  border: none;
  color: white;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 10px;
  margin: 10px;
  cursor: pointer;
  border-radius: 4px;
}

.remove-button:hover {
  background-color: rgb(160, 40, 40);
}

.message-container p {
  font-weight: bold;
}

.message-container {
  background-color: #f2f2f2;
  border: 1px solid #ddd;
  border-radius: 1vw;
  padding: 0.5vw 2vw 1.5vw;
  margin: 1vw;
  height: 25%;
  overflow-y: auto;
}

.larger-text-field {
  width: 90%;
  height: 10vh;
  resize: vertical;
  font-size: large;
}

.small-text-field {
  width: 40vh;
  font-size: x-large;
  resize: vertical;
  margin: 10px;
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

.sel-line {
  margin: 0.8vw;
}

.import-error-text {
  font-size: 1.5vh;
  color: red;
  max-height: 0.5vh;
}

.custom-file-upload {
  cursor: pointer;
}

.custom-file-input::file-selector-button {
  background: #22C55E;
  border-radius: 5px;
  color: white;
  font-size: .9rem;
  border: none;
  margin-right: 10px;
}

.custom-file-input::file-selector-button:hover {
  background: #16A34A;
  border-radius: 5px;
  color: white;
  font-size: .9rem;
  border: none;
  margin-right: 10px;
}

.select-box {
  width: 15vw;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
}

</style>