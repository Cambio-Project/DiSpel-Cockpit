<script>

import * as domain from "domain";

export default {
  computed: {
    domain() {
      return domain
    }
  },
  setup() {
    onMounted(async () => {
      preparePopups();
    });
  },
  data() {
    return {
      categories: [
        {id: "None", label: "None", icon: "i-heroicons-no-symbol-solid", color: "black"},
        {id: "UseCase", label: "UseCase", icon: "i-heroicons-user-group-solid", color: "green"},
        {id: "Growth", label: "Growth", icon: "i-heroicons-arrow-trending-up-solid", color: "blue"},
        {id: "Exploratory", label: "Exploratory", icon: "i-heroicons-light-bulb-solid", color: "purple"}],
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
      scenario: null,
      importErrorMessage: null,
      componentKey: 0,
      showTransformations: false,
    }
  },
  methods: {
    findCategoryIcon(categoryName) {
      for (let category of this.categories) {
        if (category.id === categoryName) {
          return category.icon
        }
      }
      return ""
    },
    // get fields from DB object with simulationID
    async initFields() {
      this.scenario = await getScenario(this.simID);
      const scenario = this.scenario

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
    },
    'target': {
      handler() {
        changeAllTargets([this.scenario], this.target)
      },
      deep: true
    },
  },
}


</script>

<script setup>

const config = useRuntimeConfig()

</script>

<template :key="componentKey">
  <!--Headline-->
  <!--Main Frame-->
  <div>
    <div class="container-row top-bar">
      <div class="container-row-element-xs left">
        <div class="file-upload-label">
          <label for="fileInput" class="custom-file-upload">Import Scenario</label>
          <input class="bg-blue-500" id="fileInput" type="file" ref="fileInput" @change="handleFileChange"
                 style="display: none;">
        </div>
      </div>

      <div class="container-row-element">
        <UCheckbox v-model="showTransformations" label="Show Transformations" class=" float-right mt-1 mr-2"/>
      </div>

      <div class="float-right container-row-element-xs">
        <USelectMenu placeholder="Transform to Target Logic" v-model="target" :options="targetLogics"
                     value-attribute="id" size="sm"
                     option-attribute="name"/>
      </div>
    </div>

    <div class="message-container">
      <h3> General Data</h3>
      <UDivider size="md" class="mt-2 mb-2"/>
      <br/>

      <UFormGroup label="Title" required class="mb-2">
        <UInput v-model="name" type="text" placeholder="My Scenario"/>
      </UFormGroup>

      <UFormGroup label="Category" class="mb-2">
        <USelectMenu v-model="category" :options="categories" value-attribute="id">
          <template #leading>
            <UIcon v-if="findCategoryIcon(category)" :name="(findCategoryIcon(category))" class="w-5 h-5"/>
          </template>
        </USelectMenu>
      </UFormGroup>

      <UFormGroup label="Description">
        <UTextarea v-model="description" type="text" placeholder="Enter description"></UTextarea>
      </UFormGroup>
    </div>


    <div class="message-container">
      <h3> Environment</h3>
      <UDivider size="md" class="mt-2 mb-2"/>
      <br/>

      <UDivider label="Simulation"></UDivider>

      <div class="container-row">
        <div class="container-row-element">
          <UFormGroup label="Architecture" class="mb-2">
            <input class="custom-file-input left" id="fileInput" type="file"
                   ref="fileInputEnvironmentArchitecture" @change="uploadArchitecture('environment.architecture')">
          </UFormGroup>
        </div>
        <div class="container-row-element">
          <UFormGroup label="Experiment" class="mb-2">
            <input class="custom-file-input left" id="fileInput" type="file"
                   ref="fileInputEnvironmentExperiment" @change="uploadExperiment('environment.experiment')">
          </UFormGroup>
        </div>
        <div class="container-row-element">
          <UFormGroup label="Load" class="mb-2">
            <input class="custom-file-input left" id="fileInput" type="file"
                   ref="fileInputEnvironmentLoad" @change="uploadLoad('environment.load')" multiple="multiple">
          </UFormGroup>
        </div>
      </div>

      <div class="container-row mb-4">
        <div class="container-row-element left">
          <ul>
            <li v-for="(file, index) in environmentArchitecture">
              <UButton color="red" icon="i-heroicons-trash-16-solid" square size="xs"
                       @click="removeEnvironmentArchitecture(index)"></UButton>
              {{ Object.keys(file) }}
              <br>
            </li>
          </ul>
        </div>
        <div class="container-row-element left">
          <ul>
            <li v-for="(file, index) in environmentExperiment">
              <UButton color="red" icon="i-heroicons-trash-16-solid" square size="xs"
                       @click="removeEnvironmentExperiment(index)"></UButton>
              {{ Object.keys(file) }}
              <br>
            </li>
          </ul>
        </div>
        <div class="container-row-element left">
          <ul>
            <li v-for="(file, index) in environmentLoad">
              <UButton color="red" icon="i-heroicons-trash-16-solid" square size="xs"
                       @click="removeEnvironmentLoad(index)"></UButton>
              {{ Object.keys(file) }}
              <br>
            </li>
          </ul>
        </div>
      </div>

      <UDivider label="Monitoring"></UDivider>

      <UFormGroup label="Search Window Size" class="mb-2">
        <UInput v-model="searchWindowSize" type="text" placeholder="Enter Search Window Size"/>
      </UFormGroup>

      <UFormGroup label="Monitoring Data" class="mb-2">
        <input class="custom-file-input left" id="fileInput" type="file"
               ref="fileInputEnvironmentMonitoringData" @change="uploadMonitoringData('environment.monitoringData')">
      </UFormGroup>

      <ul class="left mb-4">
        <li v-for="(file, index) in environmentMonitoringData">
          <UButton color="red" icon="i-heroicons-trash-16-solid" square size="xs"
                   @click="removeEnvironmentMonitoringData(index)"></UButton>
          {{ Object.keys(file) }}
          <br>
        </li>
      </ul>

    </div>

    <div class="message-container">
      <h3> Stimuli</h3>
      <UDivider size="md" class="mt-2 mb-2"/>
      <br/>

      <ul>
        <li v-for="(stimulus, index) in stimuli" :key="stimulus" class="mb-2">
          <div class="container-row">
            <div class="container-row-element-xxs">
              <span class="">
                {{ index + 1 }}.
              </span>
            </div>
            <div class="container-row-element">
              <i class="left"> <strong> {{ stimulus.SEL }} </strong> </i>
              <div v-if="showTransformations" class="container-row">
                <div class="container-row-element-xs">
                  <USelectMenu class="foreground" v-model="stimulus.target_logic" :options="targetLogics"
                               value-attribute="id"
                               option-attribute="name"/>
                </div>
                <div class="container-row-element mt-1 ml-2 left">
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
            <div class="container-row-element-xxs">
              <UTooltip text="Delete Stimulus Specification">
                <UButton color="red" icon="i-heroicons-trash-16-solid" square size="xs"
                         @click="removeStimulus(index)"></UButton>
              </UTooltip>
            </div>
          </div>

        </li>
      </ul>

      <UButton icon="i-heroicons-plus" color="green" size="lg" @click="toPSPWizardStimulus(this.simID, this.$router)">
        New Stimulus
      </UButton>
    </div>

    <div class="message-container">
      <h3> Responses</h3>
      <UDivider size="md" class="mt-2 mb-2"/>
      <br/>

      <ul>
        <li v-for="(response, index) in responses" :key="response" class="mb-2">
          <div class="container-row">
            <div class="container-row-element-xxs">
              <span class="">
                {{ index + 1 }}.
              </span>
            </div>
            <div class="container-row-element">
              <i class="left"> <strong> {{ response.SEL }} </strong> </i>
              <div v-if="showTransformations" class="container-row">
                <div class="container-row-element-xs">
                  <USelectMenu class="foreground" v-model="response.target_logic" :options="targetLogics"
                               value-attribute="id"
                               option-attribute="name"/>
                </div>
                <div class="container-row-element mt-1 ml-2 left">
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
            </div>
            <div class="container-row-element-xxs">
              <UTooltip text="Delete Response Specification">
                <UButton color="red" icon="i-heroicons-trash-16-solid" square size="xs"
                         @click="removeResponse(index)"></UButton>
              </UTooltip>
            </div>
          </div>

        </li>
      </ul>
      <UButton icon="i-heroicons-plus" color="green" size="lg" @click="toPSPWizardResponse(this.simID, this.$router)">
        New Response
      </UButton>

    </div>

    <div class="top-bar">
      <UDivider/>

      <div class="mt-4 mb-4">
        <!-- TODO: add stimulus check again as soon as supported -->
        <div v-if="name !== null && responses != null">
          <UButton size="xl" @click="toScenariosOverview(this.$router)">Complete</UButton>
        </div>

        <div v-else>
          <div>
            <UTooltip text="Minimum: Name and 1 Response!">
              <UButton size="xl" color="gray" @mouseover="showTooltip = true" @mouseleave="showTooltip = false">
                Complete
              </UButton>
            </UTooltip>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>


<style scoped>

h3 {
  font-size: 1.3em;
  font-weight: bolder;
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
  margin: 0 2px 2px;
  border-radius: 4px;
}

.file-upload-label:hover {
  background-color: #9bb8d3;
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
  background-color: #f4f4f4;
  border: 1px solid #ddd;
  border-radius: 1vw;
  padding: 0.5vw 2vw 1.5vw;
  margin: 1vw;
  height: 25%;
}

.top-bar {
  margin-right: 1vw;
  margin-left: 1vw;
}

.left {
  text-align: left;
  overflow: auto;
  display: block;
}

.custom-file-upload {
  cursor: pointer;
}

.custom-file-input::file-selector-button {
  background: #a0a0a0;
  border-radius: 5px;
  color: white;
  font-size: .9rem;
  border: none;
  margin-right: 10px;
}

.custom-file-input::file-selector-button:hover {
  background: #b0b0b0;
}

</style>