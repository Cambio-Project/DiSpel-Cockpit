import { createStore } from 'vuex';

//create a Vue store to save variables exchanged between different Vue components
const store = createStore({
  state: {
    stimuli: [],
    responses: [],
    outputType: null
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
    }
  },
});

export default store;