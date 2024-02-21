<script>

export default {
  data() {
    return {
      outputType: null,
      categories: ["None", "UseCase", "Growth", "Exploratory"],
      targetLogics: ["SEL", "LTL", "MTL", "Prism", "Quantitative Prism", "TBV (untimed)", "TBV (timed)"],
      target: null,
      name: this.$store.state.name,
      category: this.$store.state.category,
      description: this.$store.state.description,
      showTooltip: false
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
    addScenario() {
      this.$store.commit('addCategory', this.category);
      this.$store.commit('addDescription', this.description);
      this.$store.commit('addScenario')
      this.$router.push('/scenariosSite')
    },
  },
  computed:{
    stimuli(){
      return this.$store.state.stimuli
    },
    responses(){
      return this.$store.state.responses
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
    }
  }
  }

</script>


<template>

  <!--Headline-->
  <div class ="headline-frame">
    <h1 class="headline"> Scenario Editor </h1>
  </div>

  <!--Main Frame-->
  <div class="box-frame">
    <div>

        <h3 class="center">
          Name: 
          <input v-model="name" type="text" placeholder="Enter name" class="small-text-field"/>
          Category:
          <select v-model="category" class="select-box">
            <option v-for="category in categories" :key="category">{{ category }}</option>
          </select>
           Description:
        </h3>

        <textarea v-model="description" type="text" placeholder="Enter description" class="larger-text-field"/>
        
    </div>

    
    <div class="message-container">

      <p>Stimuli:</p>

      <li v-for="(stimulus, index) in stimuli" :key="stimulus" class="left">
        {{ index +1}}.
        <select v-model="stimulus[7]" class="select-box">
          <option v-for="targetLogic in targetLogics" :key="targetLogic" :value="targetLogics.indexOf(targetLogic)">{{ targetLogic }}</option>
        </select>
        {{ stimulus[stimulus[7]] }}
        <button class="remove-button" @click="removeStimulus(index)">Remove</button>
      </li>

      <button class="new-button" @click="openPSPStimulus">Add Stimulus</button>

    </div>
    
    <div class="message-container">

      <p>Responses:</p>
      <li v-for="(response, index) in responses" :key="response" class="left">
        {{ index +1}}.
        <select v-model="response[7]" class="select-box">
          <option v-for="targetLogic in targetLogics" :key="targetLogic" :value="targetLogics.indexOf(targetLogic)">{{ targetLogic }}</option>
        </select>
        {{ response[response[7]] }}
        <button class="remove-button" @click="removeResponse(index)">Remove</button>
      </li>

      <button class="new-button" @click="openPSPResponse">Add Response</button>

    </div>

    <div v-if="this.name.length !== 0 && stimuli.length !== 0 && responses.length !== 0">
      <button class="new-button" @click="addScenario">Complete</button>
    </div>

    <div v-else>
      <div class="info">
        <button class="not-ready-button" @mouseover="showTooltip = true" @mouseleave="showTooltip = false">Complete</button>
        <span v-if="showTooltip" class="info-text">A Name and at least one Stimulus and one Response is mandatory</span>
      </div>
      
    </div>
    
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
  height: 90vh;
  width: 100%;
  margin-top: -22px;
}

.center {
  align-items: center;
  justify-content: center;
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
  margin-top: 10px;
  cursor: pointer;
  border-radius: 4px;
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
  margin-top: 10px;
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
height: 25vh;
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

</style>