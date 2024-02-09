<script>
export default {
  name: "ScenarioList",
  el: '#app',
  data() {
    return{
      targetLogics: ["SEL", "LTL", "MTL", "Prism", "Quantitative Prism", "TBV (untimed)", "TBV (timed)"],
      target: null
  };
},
  methods:{
    // Open the ScenarioEditor
    openEditor() {
      this.$router.push('/scenarioEditorSite');
    },
    // Remove one scenario 
    removeScenario(index) {
      this.$store.commit('removeScenario', index)
    }
},
computed:{
      scenarios(){
        return this.$store.state.scenarios
      },
},
};
</script>


<template>
  <h1>DiSpel Dashboard</h1>
  <div class="btn-group">
    <button class="new-button" @click="openEditor">New Scenario</button>
  </div>
  <div class="list-container">
    <div class="list-content" ref="listContent">
      <div v-if="scenarios">
      <li v-for="(scenario, index) in scenarios" :key="index">
        <div class="headline-frame">
          {{ scenario[Object.keys(scenario)[1]] }}
        <h3>
          {{ index +1}}. {{ scenario[Object.keys(scenario)[0]] }}
        </h3>
        {{ scenario[Object.keys(scenario)[2]] }}
        <h5 class="left">
          Stimuli:
        </h5>
        <div class="left">
          <li v-for="(stimulus, index) in scenario[Object.keys(scenario)[3]]" :key="index" :class="left">
            {{ index +1}}. {{ stimulus[stimulus[7]] }}
            <select v-model="stimulus[7]" class="select-box">
              <option v-for="targetLogic in targetLogics" :key="targetLogic" :value="targetLogics.indexOf(targetLogic)">{{ targetLogic }}</option>
            </select>
        </li>
        <h5 class="left">
        Responses:
        </h5 >
        <li v-for="(response, index) in scenario[Object.keys(scenario)[4]]" :key="index" :class="left">
          {{ index +1}}. {{ response[response[7]] }}
          <select v-model="response[7]" class="select-box">
              <option v-for="targetLogic in targetLogics" :key="targetLogic" :value="targetLogics.indexOf(targetLogic)">{{ targetLogic }}</option>
            </select>
        </li>
      </div>
        <button class="remove-button" @click="removeScenario(index)">Remove Scenario</button>
      </div>
      </li>
    </div>
    </div>
  </div>
</template>


<style scoped>
.search-button {
  background-color: rgb(146, 208, 223);
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

.search-button:hover {
  background-color: rgb(87, 144, 158);
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

body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }

    .list-container {
      max-width: 1200px;
      margin: 20px auto;
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      overflow: hidden;
      height: 500px; 
    }

    .list-item {
      padding: 64px;
      border-bottom: 1px solid #e0e0e0;
      transition: background-color 0.3s;
    }

    .list-item:hover {
      background-color: #f0f0f0;
    }

    .list-content {
      max-height: 100%; 
      overflow-y: scroll; 
    }

    .highlighted {
      background-color: #d8ffcf;
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
      margin-top: 10px;
      cursor: pointer;
      border-radius: 4px;
    }
    .remove-button:hover {
      background-color: rgb(160, 40, 40);
    }

    .headline-frame {
      border: 1px solid #ccc;
      padding: 10px;
      width: 1150px; 
      box-sizing: border-box;
    }

    .bold h5{
      font-weight: bold;
      text-align: left;
    }

    .left{
      text-align: left;
      overflow: auto;
    }

    .select-box {
      width: 120px;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 8px;
    }
</style>