<script>
export default {
  name: "ScenarioList",
  el: '#app',
  data() {
    return{
      targetLogics: ["SEL", "LTL", "MTL", "Prism", "Quantitative Prism", "TBV (untimed)", "TBV (timed)"],
      target: null,
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

  <!--Headline-->
  <div class ="headline-frame">
    <h1 class="headline"> Scenarios </h1>
  </div>

  <!--Tools-->
  <div class="tool-frame">
    <div class="btn-group"> 
      <button class="new-button" @click="openEditor">New Scenario</button> 
    </div> 
  </div>
  
  <!--Scenario List-->
  <div class="box-frame">
    <div class="list-container">
      <div class="list-content">
        <div v-if="scenarios">
          <li v-for="(scenario, index) in scenarios" :key="index" class="list-item">
        
            <div v-if="scenario[Object.keys(scenario)[1]] == 'None' " class="category-frame-0">
              {{ 'None' }}
            </div>

            <div v-if="scenario[Object.keys(scenario)[1]] == 'Exploratory' " class="category-frame-1">
              {{ 'Exploratory' }}
            </div>

            <div v-if="scenario[Object.keys(scenario)[1]] == 'Growth' " class="category-frame-2">
              {{ 'Growth' }}
            </div>

            <div v-if="scenario[Object.keys(scenario)[1]] == 'UseCase' " class="category-frame-3">
              {{ 'Use Case' }}
            </div>

            <h3>
              {{ index +1}}. {{ scenario[Object.keys(scenario)[0]] }}
            </h3>

            {{ scenario[Object.keys(scenario)[2]] }}

              <h4 class="left">
                Stimuli:
              </h4>

              <li v-for="(stimulus, index) in scenario[Object.keys(scenario)[3]]" :key="index" class="left">
                <select v-model="stimulus[7]" class="select-box">
                  <option v-for="targetLogic in targetLogics" :key="targetLogic" :value="targetLogics.indexOf(targetLogic)">{{ targetLogic }}</option>
                </select>
                {{ index +1}}. {{ stimulus[stimulus[7]] }}
              </li>
            
              <h4 class="left">
              Responses:
              </h4 >

              <li v-for="(response, index) in scenario[Object.keys(scenario)[4]]" :key="index" class="left">
                <select v-model="response[7]" class="select-box">
                  <option v-for="targetLogic in targetLogics" :key="targetLogic" :value="targetLogics.indexOf(targetLogic)">{{ targetLogic }}</option>
                </select>
                {{ index +1}}. {{ response[response[7]] }}
              </li>

            <div>
              <button class="remove-button" @click="removeScenario(index)">Remove Scenario</button>
            </div>
              
          </li>
              
        </div>
      </div>
    </div>
  </div> 
          
</template>


<style scoped>

.headline-frame {
  background-color: #eaf6ff; 
  padding: 0px; 
  display: flex;
  justify-content: center; 
  align-items: center;
  height: 100px; 
  width: 100%;
}

.headline {
  color: #333; 
}

.box-frame {
  background-color: #d3d3d3;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
  width: 100%;
}

.tool-frame {
  background-color: #d3d3d3;
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
  width: 100%;
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

.new-button {
  background-color: rgb(114, 214, 101);
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin-top: 20px;
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
  width: 90%;
  background-color: #fff;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 60vh;
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