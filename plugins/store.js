import { createStore } from 'vuex';

//create a Vue store to save variables exchanged between different Vue components
const store = createStore({
  state: {
    stimuli: [],
    responses: [],
    outputType: null,
    scenarios: [['Instance Failure followed by Load Peak', 'Explorative', 'After killing service and load peak response Time should be <1 s.', 
    ['Globally, {kill 1 service instance of example-service} [holds] eventually between 20 and 20 time units.', 
    'After service instance failure has occurred then in response {increase load exponentially to 5x base load over 20 time units} [eventually holds] after 2 time units.'], 
    ['Globally, it is always the case that {ResponseTime < 1s} [holds].']],
    ['Instance Failure followed by Load Peak', 'Explorative', 'After killing service and load peak response Time should be <1 s.', 
    ['Globally, {kill 1 service instance of example-service} [holds] eventually between 20 and 20 time units.', 
    'After service instance failure has occurred then in response {increase load exponentially to 5x base load over 20 time units} [eventually holds] after 2 time units.'], 
    ['Globally, it is always the case that {ResponseTime < 1s} [holds].']]],
    scenario: [],
    name: null,
    category: null,
    description: null
  },
  mutations: {
    addStimulus(state, stimulus) {
      state.stimuli.push(stimulus);
    },
    addResponse(state, response) {
      state.responses.push(response);
    },
    setOutputType(state, outputType) {
      state.outputType = outputType;
    },
    removeStimulus(state, index) {
      state.stimuli.splice(index, 1);
    },
    removeResponse(state, index) {
      state.responses.splice(index, 1);
    },
    addScenario(state) {
      state.scenario.push(state.name, state.category, state.description, state.stimuli, state.responses);
      state.scenarios.push(state.scenario);
      state.name = null;
      state.category = null;
      state.description = null;
      state.scenario = [];
    },

    addName(state, name) {
      state.name = name;
    },

    addCategory(state, category) {
      state.category = category;
    },

    addDescription(state, description) {
      state.description = description;
    },

    removeScenario(state, index) {
      state.scenarios.splice(index, 1);
    }
  },
});

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(store);
});