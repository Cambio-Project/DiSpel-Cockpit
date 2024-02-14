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
  <h1 class ="headline-frame">
    Scenario Editor
  </h1>

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
        {{ index +1}}. {{ stimulus[stimulus[7]] }}
        <select v-model="stimulus[7]" class="select-box">
          <option v-for="targetLogic in targetLogics" :key="targetLogic" :value="targetLogics.indexOf(targetLogic)">{{ targetLogic }}</option>
        </select>
        <button class="remove-button" @click="removeStimulus(index)">Remove</button>
      </li>

      <button class="new-button" @click="openPSPStimulus">Add Stimulus</button>

    </div>
    
    <div class="message-container">

      <p>Responses:</p>
      <li v-for="(response, index) in responses" :key="response" class="left">
        {{ index +1}}. {{ response[response[7]] }}
        <select v-model="response[7]" class="select-box">
          <option v-for="targetLogic in targetLogics" :key="targetLogic" :value="targetLogics.indexOf(targetLogic)">{{ targetLogic }}</option>
        </select>
        <button class="remove-button" @click="removeResponse(index)">Remove</button>
      </li>

      <button class="new-button" @click="openPSPResponse">Add Response</button>

    </div>

    <button class="new-button" @click="addScenario">Complete</button>
    
  </div>

</template>


<style scoped>

.headline-frame {
  background-color: #eaf6ff; 
  display: flex;
  justify-content: center; 
  align-items: center;
  height: 100px; 
  width: 100%;
  margin-left: 0px;
}
.box-frame {
  background-color: #d3d3d3;
  display:block;
  justify-content: center;
  align-items: center;
  height: 80vh;
  width: 100%;
  margin: -40px;
  margin-left: 0px;
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

body {
  font-family: 'Arial', sans-serif;
  background-color: #f4f4f4;
}

.message-container p {
font-weight: bold;
}

.message-container {
background-color: #f2f2f2;
border: 1px solid #ddd;
border-radius: 1vw;
padding-top: 0.5vw;
padding-bottom: 1.5vw;
margin: 1vw;
height: 20vh;
overflow-y: auto;
}

.larger-text-field {
  width: 200vh;
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