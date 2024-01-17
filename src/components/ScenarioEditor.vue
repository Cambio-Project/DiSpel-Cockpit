<script>

export default {
  data() {
    return {
      outputType: null,
      name: null,
      description: null,
      categories: ["None", "UseCase", "Growth", "Exploratory"],
      selectedCategory: null
    }
  },
  methods:{
    // create stimulus with pspwizard
    openPSPStimulus() {
      this.outputType= 'Stimulus';
      this.$store.commit('setOutputType', this.outputType)
      this.$router.push('/pspwizard');
    },
    // create response with pspwizard
    openPSPResponse() {
      this.outputType= 'Response';
      this.$store.commit('setOutputType', this.outputType)
      this.$router.push('/pspwizard');
    },
    // remove stiumulus
    removeStimulus(index) {
      this.$store.commit('removeStimulus', index)
    },
    // remove response
    removeResponse(index) {
      this.$store.commit('removeResponse', index)
    },
  },
  computed:{
    stimuli(){
      return this.$store.state.stimuli
    },
    responses(){
      return this.$store.state.responses
    },
  }
  }

</script>


<template>
  <h1>Scenario Editor</h1>

    <div>
      <h3>Name: 
      <input v-model="name" type="text" placeholder="Enter name" class="small-text-field" />
      </h3>
      <h3>Category:
        <select v-model="selectedCategory" class="select-box">
        <option v-for="category in categories" :key="category">{{ category }}</option>
      </select>
    </h3>
      

      <div>
      <h3>Description: 
        <textarea v-model="description" type="text" placeholder="Enter description" class="larger-text-field"/>
      </h3>
    </div>
    </div>
    <div>
      <div class="message-container">
      <p>Stimuli:</p>
      <li  v-for="(stimulus, index) in stimuli" :key="stimulus" >{{ index +1}}. {{ stimulus }}
        <button class="remove-button" @click="removeStimulus(index)">Remove</button>
      </li>
      <button class="new-button" @click="openPSPStimulus">Add Stimulus</button>
    </div>
    </div>

    <div>
      <div class="message-container">
      <p>Responses:</p>
      <li v-for="(response, index) in responses" :key="response" >{{ index +1}}. {{ response }}
        <button class="remove-button" @click="removeResponse(index)">Remove</button>
      </li>
      <button class="new-button" @click="openPSPResponse">Add Response</button>
    </div>
    </div>
    
</template>


<style scoped>

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
  margin-top: 10px;
  cursor: pointer;
  border-radius: 4px;
}
.remove-button:hover {
  background-color: rgb(160, 40, 40);
}

body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
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
    margin: 2vw;
    min-height: 6vw;
    max-height: 40vh;
    overflow-y: auto;
  }

  .larger-text-field {
  width: 800px;
  height: 150px;
  resize: vertical; 
}

.small-text-field {
  width: 500px;
  resize: vertical;
}

.select-box {
  width: 300px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>