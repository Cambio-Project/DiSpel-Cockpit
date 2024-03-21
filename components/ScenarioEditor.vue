<script>

import * as domain from "domain";

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
      responses: null,

      importErrorMessage: null,
      componentKey: 0,
    }
  },
  methods:{
    // get fields from DB object with simulationID
    async initFields() {
      const res = await fetch("/api/getScenario", {
        method: "POST",
        body: JSON.stringify({
          simulationID: this.simID
        })
      })
      const body = await res.json()
      console.log(this.simID)
      console.log(body.Scenario)

      if (typeof body.Scenario.name !== "undefined") {
        this.name = body.Scenario.name
      }
      if (typeof body.Scenario.category !== "undefined") {
        this.category = body.Scenario.category
      }
      if (typeof body.Scenario.description !== "undefined") {
        this.description = body.Scenario.description
      }
      if (typeof body.Scenario.stimuli !== "undefined") {
        this.stimuli = body.Scenario.stimuli
      }
      if (typeof body.Scenario.responses !== "undefined") {
        this.responses = body.Scenario.responses
      }
    },
    // create response with PSPWizard
    openPSPResponse() {
      this.$router.push('/pspwizardSite?simID='+ this.simID);
    },
    // remove stimulus
    async removeStimulus(index) {
      const res = await fetch("/api/deleteScenarioField", {
        method: "POST",
        body: JSON.stringify({
          simulationID: this.simID,
          fieldName: "stimuli",
          fieldIndex: index
        })
      })
    const body = await res.json()
    console.log(body)
    await this.initFields()
    },
    // remove response from the scenario entry in the Scenario MongoDB table
    async removeResponse(index) {
      const res = await fetch("/api/deleteScenarioField", {
        method: "POST",
        body: JSON.stringify({
          simulationID: this.simID,
          fieldName: "responses",
          fieldIndex: index
        })
      })
    const body = await res.json()
    console.log(body)
    await this.initFields()
    },
    // add scenario with metadata and stimuli and responses
    async complete() {
      this.$router.push('/scenariosSite');
    },
    // changes all target logics to the same one
    changeAllTargets() {
      this.responses.forEach(response => {
        response.target_logic = this.target;
      })
    },
    // used for uploading stimuli
    async upload(type) {
      const fileInput = this.$refs.fileInputStimulus;
      this.stimuli = []
      this.loadedFiles = []
      for (const file of fileInput.files) {
        const filename = file.name
        if (filename.split(".").pop() === "json"){
          const jsonAsText = await file.text()
          const json = JSON.parse(jsonAsText)
          const tmp = {
            [filename]: json
          }
          this.addValue(type, tmp)

        } else {
          const formdata = new FormData()
          formdata.append(filename, file)
          await fetch("/api/uploadAdditionalStimuliFile", {
            method: "POST",
            body: formdata
          })
          const tmp = {
            [filename]: "external"
          }
          this.addValue(type, tmp)
        }
        this.loadedFiles.push(filename)
      }
      await this.initFields()
      location.reload();
    },
    // imports a scenario
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
          if(jsonData.name==null && jsonData.category==null && jsonData.description==null && jsonData.stimuli==null && jsonData.responses==null) {
            this.importErrorMessage = "The imported scenario has no valid field. Define either one or more of the fields name, category, description, stimuli and responses.";
            return;
          }

          // reset all fields
          this.resetAllFields();

          // name
          if(jsonData.name != null) {
            this.name = jsonData.name;
            this.setValue("name", this.name)
          }

          // category
          if(jsonData.category != null) {
            this.category = jsonData.category;
            this.setValue("category", this.category)
          }

          // description
          if(jsonData.description != null) {
            this.description = jsonData.description;
            this.setValue("description", this.description)
          }

          // stimuli
          this.stimuli = []
          if(jsonData.stimuli != null) {
            jsonData.stimuli.forEach(element => {
              this.stimuli.push(element);
            });
            this.setValue("stimuli", this.stimuli)
          } else {
            this.setValue("stimuli", [])
          }

          // response
          this.responses = []
          if(jsonData.responses != null) {
            jsonData.responses.forEach(element => {
              this.responses.push(element);
            });
            this.setValue("responses", this.responses)
          } else {
            this.setValue("responses", [])
          }
          this.initFields()

          this.importErrorMessage = null

          // reloads the page, necessary to display everything
          setTimeout(() => {
            location.reload();
          }, 500);

        } catch (error) {
          // mapping not valid
          this.importErrorMessage = "The imported scenario is not valid! Technical error message: \n "+error
          console.error('Error parsing JSON:', error);
        }
      };

      fileReader.readAsText(file);
    },
    // resets all fields
    resetAllFields() {
      this.target= null,
      this.name= "",
      this.category= "None",
      this.description= null,
      this.stimuli= null,
      this.responses= null
    },
    // adds a new value to a scenario field of the Scenario MongoDB table
    async addValue(field, newValue){
      const res = await fetch("/api/pushScenarioField", {
        method: "POST",
        body: JSON.stringify({
          simulationID: this.simID,
          fieldName: field,
          fieldValue: newValue
        })
      })
      const body = await res.json()
      console.log(body)
    },
    // sets a new value to a scenario field of the Scenario MongoDB table
    async setValue(field, newValue){
      const res = await fetch("/api/setScenarioField", {
        method: "POST",
        body: JSON.stringify({
          simulationID: this.simID,
          fieldName: field,
          fieldValue: newValue
        })
      })
      const body = await res.json()
      console.log(body)
    }
  },
  // gets executed on page load
  beforeMount() {
    this.initFields();
  },
  // if these fields change, they get added to the MongoDB
  watch:{
      name(newName) {
        this.addValue("name", newName)
      },
      category(newCategory) {
        this.addValue("category", newCategory)
      },
      description(newDescription) {
        this.addValue("description", newDescription)
      },
    },
  }



</script>

<template :key="componentKey">
  <!--Headline-->
  <div>
    <h1 class="text-3xl mt-2"> Scenario Editor </h1>
  </div>

  <!--Main Frame-->
  <div>
        <h3 class="center">

          <div class="file-upload-label">
            <label for="fileInput" class="custom-file-upload">Import Scenario</label>
            <input class="bg-gray-500" id="fileInput" type="file" ref="fileInput" @change="handleFileChange" style="display: none;">
          </div>

          <input v-model="name" type="text" placeholder="Enter scenario name" class="small-text-field p-1 border-2 rounded-xl"/>
          Category:
          <select v-model="category" class="select-box">
            <option v-for="category in categories" :key="category">{{ category }}</option>
          </select>
        </h3>

        <textarea v-model="description" type="text" placeholder="Enter description" class="larger-text-field p-1 border-2 rounded-xl" />

        <div>
        {{ "Transform all Target Logics to " }}
        <select class="select-box" @change="changeAllTargets" v-model="target">
            <option v-for="targetLogic in targetLogics" :key="targetLogic" :value="targetLogics.indexOf(targetLogic)">{{ targetLogic }}</option>
        </select>
      </div>

    <div class="message-container">

      <p>Stimuli:</p>

      <input class="custom-stimuli-input" id="fileInput" type="file" ref="fileInputStimulus" @change="upload('stimuli')" multiple="multiple">

      <ul>
        <li v-for="(file, index) in stimuli">
          {{Object.keys(file)}}
        <button class="remove-button" @click="removeStimulus(index)">Remove</button> <br>
      </li>
      </ul>
      
    </div>

    <div class="message-container">
      <p class="mb-2">Responses:</p>
      <li v-for="(response, index) in responses" :key="response" class="left">
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
        
        <button class="remove-button" @click="removeResponse(index)">Remove</button> <br>
        <i class="sel-line"> <strong>SEL:</strong> {{ response.SEL }} </i> <br> <br>

      </li>

      <UButton @click="openPSPResponse">Add Response</UButton>

    </div>

    <div class="mt-2">
      <div v-if="name !== null && stimuli != null && responses != null">
        <UButton @click="complete">Complete</UButton>
      </div>

      <div v-else>
        <div>
          <UTooltip text="Minimum: Name, 1 Stimulus and 1 Response!">
            <UButton color="gray" @mouseover="showTooltip = true" @mouseleave="showTooltip = false">Complete</UButton>
          </UTooltip>
       </div>
      </div>
    </div>
  </div>

</template>


<style scoped>

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
  margin: 2px;
  margin-top: 20px;
  border-radius: 4px;
}

.file-upload-label:hover {
  background-color: #9bb8d3;
}

.not-ready-button:hover .info-text {
  display: block;
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
padding-left: 2vw;
padding-right: 2vw;
padding-top: 0.5vw;
padding-bottom: 1.5vw;
margin: 1vw;
height: 25%;
overflow-y: auto;
}

.larger-text-field {
  width: 195vh;
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

.sel-line {
  margin: 0.8vw;
}

.custom-file-upload {
  cursor: pointer;
}

.custom-stimuli-input::file-selector-button{
  background: #22C55E;
  border-radius: 5px;
  color: white;
  font-size: .9rem;
  border: none;
  margin-right: 10px;
}

.custom-stimuli-input::file-selector-button:hover{
  background: #16A34A;
  border-radius: 5px;
  color: white;
  font-size: .9rem;
  border: none;
  margin-right: 10px;
}

</style>