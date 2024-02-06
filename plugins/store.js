import { createStore } from 'vuex';

//create a Vue store to save variables exchanged between different Vue components
const store = createStore({
  state: {
    stimuli: [],
    responses: [],
    outputType: null,
    scenarios: [
      //1.Szenario
      [
      //Name
      'Instance Failure followed by Load Peak', 
      //Category
      'Explorative', 
      //Description
      'After killing service and load peak response Time should be <1 s.', 
      [ //Stimuli in each logic
        [//1.Stimulus
          'Globally, {kill 1 service instance of example-service} [holds] eventually between 20 and 20 time units.', 
          'LTL', 
          'MTL', 
          'Prism', 
          'Qantitative Prism', 
          'TBV (timed)', 
          'TBV (untimed)',
          //DisplayLogic
          0
        ], 
        [//2.Stimulus
          'After service instance failure has occurred then in response {increase load exponentially to 5x base load over 20 time units} [eventually holds] after 2 time units.',
          'LTL', 
          'MTL', 
          'Prism', 
          'Qantitative Prism', 
          'TBV (timed)', 
          'TBV (untimed)',
          //DisplayLogic
          1
        ]
      ], 
      [ //Responses in each logic
        [//1.Response
          'Globally, it is always the case that {ResponseTime < 1s} [holds].', 
          'LTL', 
          'MTL', 
          'Prism', 
          'Qantitative Prism', 
          'TBV (timed)', 
          'TBV (untimed)',
          //DisplayLogic
          2
        ]
      ]
    ],
    //2.Szenario
    [
      //Name
      'Instance Failure followed by Load Peak', 
      //Category
      'Explorative', 
      //Description
      'After killing service and load peak response Time should be <1 s.', 
      [ //Stimuli in each logic
        [//1.Stimulus
          'Globally, {kill 1 service instance of example-service} [holds] eventually between 20 and 20 time units.', 
          'LTL', 
          'MTL', 
          'Prism', 
          'Qantitative Prism', 
          'TBV (timed)', 
          'TBV (untimed)',
          //DisplayLogic
          3
        ], 
        [//2.Stimulus
          'After service instance failure has occurred then in response {increase load exponentially to 5x base load over 20 time units} [eventually holds] after 2 time units.',
          'LTL', 
          'MTL', 
          'Prism', 
          'Qantitative Prism', 
          'TBV (timed)', 
          'TBV (untimed)',
          //DisplayLogic
          4
        ]
      ], 
      [ //Responses in each logic
        [//1.Response
          'Globally, it is always the case that {ResponseTime < 1s} [holds].', 
          'LTL', 
          'MTL', 
          'Prism', 
          'Qantitative Prism', 
          'TBV (timed)', 
          'TBV (untimed)',
          //DisplayLogic
          5
        ]
      ]
    ]
  ],
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
      state.stimuli = [];
      state.responses = [];
      state.display_logic = null;
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