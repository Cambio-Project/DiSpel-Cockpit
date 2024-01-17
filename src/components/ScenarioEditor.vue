<script>

export default {
  data() {
    return {
      outputType: null
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
    }
  }
  }

</script>


<template>
  <h1>Scenario Editor</h1>

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
</style>