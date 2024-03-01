import { createStore } from 'vuex';

//create a Vue store to save variables exchanged between different Vue components
const store = createStore({
  state: {
    stimuli: [],
    responses: [],
    outputType: "Stimulus",
    scenarios: [
      //1.Szenario
      [
      //Name
      'Instance Failure followed by Load Peak', 
      //Category
      'Exploratory', 
      //Description
      'After killing service and load peak response Time should be <1 s.', 
      [ //Stimuli in each logic
        [//1.Stimulus
          'Globally, {kill 1 service instance of example-service} [holds] eventually between 20 and 20 time units.', 
          '◇ (kill 1 service instance of example-service)', 
          '◇[20,20] (kill 1 service instance of example-service)', 
          '[ F[20,20] (kill 1 service instance of example-service) ]', 
          'P=? [ F[20,20] (kill 1 service instance of example-service) ]', 
          'once (kill 1 service instance of example-service)', 
          'once[20,20] (kill 1 service instance of example-service)',
          //DisplayLogic
          0
        ], 
        [//2.Stimulus
          'After {kill 1 service instance of example-service} if {service instance failure} [has occurred] then in response {increase load exponentially to 5x base load over 20 time units} [eventually holds] after 2 time units without {A(a)} [holding] in between.',
          '☐((kill 1 service instance of example-service) → ☐((service instance failure) → (¬(A(a)) U (increase load exponentially to 5x base load over 20 time units))))', 
          '☐((kill 1 service instance of example-service) → (☐((service instance failure) → ¬(A(a)) U[2,∞) (increase load exponentially to 5x base load over 20 time units))))', 
          '[ G((kill 1 service instance of example-service) => G((service instance failure) => !(A(a)) U>=2 (increase load exponentially to 5x base load over 20 time units))) ]', 
          'P=? [ G((kill 1 service instance of example-service) => G((service instance failure) => !(A(a)) U>=2 (increase load exponentially to 5x base load over 20 time units))) ]', 
          'always((kill 1 service instance of example-service) -> always((service instance failure) -> ( not (A(a)) since (increase load exponentially to 5x base load over 20 time units))))', 
          'always((kill 1 service instance of example-service) -> (always((service instance failure) -> not (A(a)) since[2,inf] (increase load exponentially to 5x base load over 20 time units))))',
          //DisplayLogic
          1
        ]
      ], 
      [ //Responses in each logic
        [//1.Response
          'Globally, it is always the case that {ResponseTime < 1s} [holds].', 
          '☐ (ResponseTime < 1s)', 
          '☐ (ResponseTime < 1s)', 
          '[ G (ResponseTime < 1s) ]', 
          'P=? [ G (ResponseTime < 1s) ]', 
          'always (ResponseTime < 1s)', 
          'always (ResponseTime < 1s)',
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
      'Growth', 
      //Description
      'After killing service and load peak response Time should be <1 s.', 
      [ //Stimuli in each logic
        [//1.Stimulus
        'Globally, {kill 1 service instance of example-service} [holds] eventually between 20 and 20 time units.', 
        '◇ (kill 1 service instance of example-service)', 
        '◇[20,20] (kill 1 service instance of example-service)', 
        '[ F[20,20] (kill 1 service instance of example-service) ]', 
        'P=? [ F[20,20] (kill 1 service instance of example-service) ]', 
        'once (kill 1 service instance of example-service)', 
        'once[20,20] (kill 1 service instance of example-service)',
          //DisplayLogic
          3
        ], 
        [//2.Stimulus
        'After {kill 1 service instance of example-service} if {service instance failure} [has occurred] then in response {increase load exponentially to 5x base load over 20 time units} [eventually holds] after 2 time units without {A(a)} [holding] in between.',
        '☐((kill 1 service instance of example-service) → ☐((service instance failure) → (¬(A(a)) U (increase load exponentially to 5x base load over 20 time units))))', 
        '☐((kill 1 service instance of example-service) → (☐((service instance failure) → ¬(A(a)) U[2,∞) (increase load exponentially to 5x base load over 20 time units))))', 
        '[ G((kill 1 service instance of example-service) => G((service instance failure) => !(A(a)) U>=2 (increase load exponentially to 5x base load over 20 time units))) ]', 
        'P=? [ G((kill 1 service instance of example-service) => G((service instance failure) => !(A(a)) U>=2 (increase load exponentially to 5x base load over 20 time units))) ]', 
        'always((kill 1 service instance of example-service) -> always((service instance failure) -> ( not (A(a)) since (increase load exponentially to 5x base load over 20 time units))))', 
        'always((kill 1 service instance of example-service) -> (always((service instance failure) -> not (A(a)) since[2,inf] (increase load exponentially to 5x base load over 20 time units))))',
          //DisplayLogic
          4
        ]
      ], 
      [ //Responses in each logic
        [//1.Response
        'Globally, it is always the case that {ResponseTime < 1s} [holds].', 
        '☐ (ResponseTime < 1s)', 
        '☐ (ResponseTime < 1s)', 
        '[ G (ResponseTime < 1s) ]', 
        'P=? [ G (ResponseTime < 1s) ]', 
        'always (ResponseTime < 1s)', 
        'always (ResponseTime < 1s)',
          //DisplayLogic
          5
        ]
      ]
    ]
  ],
    scenario: [],
    name: "",
    category: "None",
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
      state.name = "";
      state.category = "None";
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