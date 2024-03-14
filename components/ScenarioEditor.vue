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
      outputType: null,
      categories: ["None", "UseCase", "Growth", "Exploratory"],
      targetLogics: ["SEL", "LTL", "MTL", "Prism", "Quantitative Prism", "TBV (untimed)", "TBV (timed)"],
      target: null,
      name: this.$store.state.name,
      category: this.$store.state.category,
      description: this.$store.state.description,
      showTooltip: false,
      stimuli: this.$store.state.stimuli,
      responses: this.$store.state.responses,
      importErrorMessage: null,
    }
  },
  methods:{
    // create stimulus with pspwizard
    openPSPStimulus() {
      this.outputType= 'Stimulus';
      this.$store.commit('setOutputType', this.outputType);
      this.$router.push('/pspwizardSite');
    },
    // create response with pspwizard
    openPSPResponse() {
      this.outputType= 'Response';
      this.$store.commit('setOutputType', this.outputType);
      this.$router.push('/pspwizardSite');
    },
    // remove stiumulus
    removeStimulus(index) {
      this.$store.commit('removeStimulus', index);
    },
    // remove response
    removeResponse(index) {
      this.$store.commit('removeResponse', index);
    },
    // add scenario with metadata and stimuli and responses
    async addScenario() {
      // this.$store.commit('addCategory', this.category);
      // this.$store.commit('addDescription', this.description);
      // this.$store.commit('setStimuli', this.stimuli);
      // this.$store.commit('setResponses', this.responses);
      // this.$store.commit('addScenario');

      const body = {
        name: this.name,
        category: this.category,
        description: this.description,
        stimuli: this.stimuli,
        responses: this.responses
      }

      const res = await fetch("/api/saveScenario", {
        method: "POST",
        body: JSON.stringify(body)
      })

      this.$router.push('/scenariosSite');

    },
    //Changes all target logics to the same one
    changeAllTargets() {
      this.stimuli.forEach(stimulus => {
        stimulus[7]= this.target;
      })
      this.responses.forEach(response => {
        response[7]= this.target;
      })
    },
    async uploadStimulus() {
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
          this.stimuli.push(tmp)

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
          this.stimuli.push(tmp)
        }
        this.loadedFiles.push(filename)
      }
    },
    //imports a scenario
    handleFileChange() {
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
          }

          // category
          if(jsonData.category != null) {
            this.category = jsonData.category;
          }

          // description
          if(jsonData.description != null) {
            this.description = jsonData.description;
          }

          var jsonlist = [];

          // stimuli
          if(jsonData.stimuli != null) {
            jsonData.stimuli.forEach(element => {
              if(element.SEL == null) {
                this.importErrorMessage = "SEL in each stimulus need to be defined.";
                console.warn(this.importErrorMessage);
                return;
              }
              else {
                jsonlist.push(element.SEL);
              }
              if(element.LTL == null) {
                jsonlist.push("LTL not defined");
              }
              else {
                jsonlist.push(element.LTL);
              }
              if(element.MTL == null) {
                jsonlist.push("MTL not defined");
              }
              else {
                jsonlist.push(element.MTL);
              }
              if(element.Prism == null) {
                jsonlist.push("Prism not defined");
              }
              else {
                jsonlist.push(element.Prism);
              }
              if(element.Quantitative_Prism == null) {
                jsonlist.push("Quantitative_Prism not defined");
              }
              else {
                jsonlist.push(element.Quantitative_Prism);
              }
              if(element.TBV_timed == null) {
                jsonlist.push("TBV_timed not defined");
              }
              else {
                jsonlist.push(element.TBV_timed);
              }
              if(element.TBV_untimed == null) {
                jsonlist.push("TBV_untimed not defined");
              }
              else {
                jsonlist.push(element.TBV_untimed);
              }
              if(element.display_logic == null) {
                jsonlist.push(0);
              }
              else {
                jsonlist.push(element.display_logic);
              }
              this.stimuli.push(jsonlist);
              jsonlist = [];

            });
          }

          // responses
          if(jsonData.responses != null) {
            jsonData.responses.forEach(element => {
              if(element.SEL == null) {
                this.importErrorMessage = "SEL in each response need to be defined.";
                console.warn(this.importErrorMessage);
                return;
              }
              else {
                jsonlist.push(element.SEL);
              }
              if(element.LTL == null) {
                jsonlist.push("LTL not defined");
              }
              else {
                jsonlist.push(element.LTL);
              }
              if(element.MTL == null) {
                jsonlist.push("MTL not defined");
              }
              else {
                jsonlist.push(element.MTL);
              }
              if(element.Prism == null) {
                jsonlist.push("Prism not defined");
              }
              else {
                jsonlist.push(element.Prism);
              }
              if(element.Quantitative_Prism == null) {
                jsonlist.push("Quantitative_Prism not defined");
              }
              else {
                jsonlist.push(element.Quantitative_Prism);
              }
              if(element.TBV_timed == null) {
                jsonlist.push("TBV_timed not defined");
              }
              else {
                jsonlist.push(element.TBV_timed);
              }
              if(element.TBV_untimed == null) {
                jsonlist.push("TBV_untimed not defined");
              }
              else {
                jsonlist.push(element.TBV_untimed);
              }
              if(element.display_logic == null) {
                jsonlist.push(0);
              }
              else {
                jsonlist.push(element.display_logic);
              }
              this.responses.push(jsonlist);
              jsonlist = [];
            });
          }

          this.importErrorMessage = null

        } catch (error) {
          // mapping not valid
          this.importErrorMessage = "The imported scenario is not valid! Technical error message: \n "+error
          console.error('Error parsing JSON:', error);
        }
      };

      fileReader.readAsText(file);
    },
    resetAllFields() {
      this.outputType = null,
      this.target= null,
      this.name= "",
      this.category= "None",
      this.description= null,
      this.stimuli= [],
      this.responses= [],
      this.showTooltip= false
    },
  },
  watch:{
    name(newName) {
      this.$store.commit('addName', newName);
    },
    category(newCategory) {
      this.$store.commit('addCategory', newCategory);
    },
    description(newDescription) {
      this.$store.commit('addDescription', newDescription);
    },
    stimuli(newStimuli) {
      this.$store.commit('setStimuli', newStimuli);
    },
    responses(newResponses) {
      this.$store.commit('setResponses', newResponses);
    }
  }
  }



</script>

<script setup>
const config = useRuntimeConfig()
const domain = "http://"+config.public.miSimDomain+":"+config.public.miSimPort+"/simulate/upload"

</script>

<template>

  <!--Headline-->
  <div class ="headline-frame">
    <h1 class="headline"> Scenario Editor </h1>
  </div>

  <!--Main Frame-->
  <div class="box-frame">

<!--        <div v-if="this.importErrorMessage">-->
<!--          <pre class="import-error-text">{{ this.importErrorMessage }}</pre>-->
<!--        </div>-->

        <h3 class="center">

          <div class="file-upload-label">
            <label for="fileInput" class="custom-file-upload">Import Scenario</label>
            <input id="fileInput" type="file" ref="fileInput" @change="handleFileChange" style="display: none;">
          </div>

          Name:
          <input v-model="name" type="text" placeholder="Enter name" class="small-text-field"/>
          Category:
          <select v-model="category" class="select-box">
            <option v-for="category in categories" :key="category">{{ category }}</option>
          </select>
           Description:
        </h3>

        <textarea v-model="description" type="text" placeholder="Enter description" class="larger-text-field"/>

        <div>
        {{ "Transform all Target Logics to " }}
        <select class="select-box" @change="changeAllTargets" v-model="target">
            <option v-for="targetLogic in targetLogics" :key="targetLogic" :value="targetLogics.indexOf(targetLogic)">{{ targetLogic }}</option>
        </select>
      </div>

    <div class="message-container">

      <p>Stimuli:</p>

<!--      <li v-for="(stimulus, index) in stimuli" :key="stimulus" class="left">-->
<!--        {{ index +1}}.-->
<!--        <select v-model="stimulus[7]" class="select-box">-->
<!--          <option v-for="targetLogic in targetLogics" :key="targetLogic" :value="targetLogics.indexOf(targetLogic)">{{ targetLogic }}</option>-->
<!--        </select>-->

<!--        {{ stimulus[stimulus[7]] }}-->
<!--        <button class="remove-button" @click="removeStimulus(index)">Remove</button> <br>-->
<!--        <i class="sel-line"> <strong>SEL:</strong> {{ stimulus[0] }} </i> <br> <br>-->

<!--      </li>-->

      <input id="fileInput" type="file" ref="fileInputStimulus" @change="uploadStimulus" multiple="multiple">

<!--      <button class="new-button" @click="openPSPStimulus">Add Stimulus</button>-->

      <ul>
        <li v-for="file in stimuli">{{file}}</li>
      </ul>
      
    </div>

    <div class="message-container">

      <p>Responses:</p>
      <li v-for="(response, index) in responses" :key="response" class="left">
        {{ index +1}}.
        <select v-model="response[7]" class="select-box">
          <option v-for="targetLogic in targetLogics" :key="targetLogic" :value="targetLogics.indexOf(targetLogic)">{{ targetLogic }}</option>
        </select>

        {{ response[response[7]] }}
        <button class="remove-button" @click="removeResponse(index)">Remove</button> <br>
        <i class="sel-line"> <strong>SEL:</strong> {{ response[0] }} </i> <br> <br>

      </li>

      <button class="new-button" @click="openPSPResponse">Add Response</button>

    </div>

<!--    <div v-if="this.name.length !== 0 && this.stimuli.length !== 0 && this.responses.length !== 0">-->
    <div>
      <button class="new-button" @click="addScenario">Complete</button>
    </div>

<!--    <div v-else>-->
<!--      <div class="info">-->
<!--        <button class="not-ready-button" @mouseover="showTooltip = true" @mouseleave="showTooltip = false">Complete</button>-->
<!--        <span v-if="showTooltip" class="info-text">A Name and at least one Stimulus and one Response is mandatory</span>-->
<!--      </div>-->
<!--    </div>-->

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
.box-frame {
  background-color: #d3d3d3;
  justify-content:center;
  align-items:center;
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
  margin: 2px;
  margin-top: 20px;
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
  width: text-align;
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
</style>