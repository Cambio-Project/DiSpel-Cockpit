import { createStore } from 'vuex';

//create a Vue store to save variables exchanged between different Vue components
const store = createStore({
  state: {
    stimuli: [],
    responses: [],
    outputType: null,
    scenarios: [['test', 'none', 'a', ['def'], ['abc']]],
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

export default store;