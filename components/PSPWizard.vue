<script>

export default {
  data() {
    return {
      patterTypeOptions: [{
        value: 'Occurrence',
        label: 'Occurrence'
      }, {
        value: 'Order',
        label: 'Order'
      }],
      stimulusItems: [{
        key: 'addCommand',
        label: 'Add Command',
        description: 'Add a new command as predicate to become available in the specification.'
      }, {
        key: 'editCommand',
        label: 'Edit Command',
        description: 'Edit an existing command.'
      }, {
        key: 'addListener',
        label: 'Add Listener',
        description: 'Add a new listener as predicate to become available in the specification.'
      }, {
        key: 'editListener',
        label: 'Edit Listener',
        description: 'Edit an existing listener.'
      }],
      responseItems: [{
        key: 'addEvent',
        label: 'Add Event',
        description: 'Add a new event as predicate to become available in the specification.'
      }, {
        key: 'editEvent',
        label: 'Edit Event',
        description: 'Edit an existing event.'
      }, {
        key: 'manageMeasurementSource',
        label: 'Manage Measurement Source',
        description: 'Create and Delete Measurement Sources.'
      }],
      patternItems: [{
        key: 'scope',
        label: 'Scope',
        description: 'Select the scope within the specification should hold.'
      }, {
        key: 'pattern',
        label: 'Pattern',
        description: 'Select the type of the pattern to be used.'
      }, {
        key: 'time-bound',
        label: 'Time Bound',
        description: 'Add a time bound to the pattern.'
      }, {
        key: 'probability-bound',
        label: 'Probability Bound',
        description: 'Add a probability bound to the pattern.'
      }],
      commandOptions: [
        "kill", "load"
      ],
      listenerOptions: [
        "event"
      ],
      loadFunctionOptions: [
        "constant", "exponential", "exponential-inverse", "linear", "linear-inverse"
      ],
      pspSpecification: {
        selectedPatternType: null,
        selectedScope: null,
        selectedOccurrence: null,
        selectedOrder: null,
        selectedScopeEventQ: null,
        selectedScopeEventR: null,
        selectedEventP: null,
        selectedEventS: null,
        selectedChainedEvents: [],
        selectedConstraintEvent: "Constraint",
        selectedTime: null,
        selectedInterval: null,
        selectedTimeUnitType: "time units",
        selectedTargetLogic: "SEL",
        mapping: null,
        selectedTimeBound: null,
        selectedProbabilityBound: null,
        upperLimit: null,
        lowerLimit: null,
        probability: null,
        timeUnit: "time units",
        interval: ["Interval"]
      },
      events: [],
      simID: this.$route.query.simID,
      type: this.$route.query.type,
      scenario: null,
      customCommandName: "",
      customCommandContent: "",
      customListenerName: "",
      customListenerContent: "",
      customPredicateName: "",
      customPredicateLogic: "",
      customMeasurementSource: "",
      newMeasurementSource: "",
      deleteMarkedMeasurementSource: "",
      customPredicateComparisonValue: "",
      eventToChange: "",
      commandToChange: "",
      listenerToChange: "",
      changedCommandName: "",
      changedCommandContent: "",
      changedListenerName: "",
      changedListenerContent: "",
      changedPredicateName: "",
      changedPredicateLogic: "",
      changedMeasurementSource: "",
      changedPredicateComparisonValue: "",
      changedEventId: "",
      changedCommandId: "",
      changedListenerId: "",
      predicateLogicOptions: ['equal', 'smallerEqual', 'smaller', 'biggerEqual', 'bigger', 'trendUpward', 'trendUpwardStrict', 'trendDownward', 'trendDownwardStrict',],
      measurementSourceOptions: null,
      scopeOptions: ["Globally", "BeforeR", "AfterQ", "BetweenQandR", "AfterQUntilR"],
      occurrenceOptions: ["SteadyState", "MinimumDuration", "MaximumDuration", "Recurrence", "Universality", "Absence", "Existence", "BoundedExistence", "TransientState"],
      orderOptions: ["Response", "ResponseChain1N", "ResponseChainN1", "ResponseInvariance", "Precedence", "PrecedenceChain1N", "PrecedenceChainN1", "Until"],
      targetLogicOptions: ["SEL", "LTL", "MTL", "Prism", "Quantitative Prism", "TBV (untimed)", "TBV (timed)"],
      checkedProbability: false,
      checkedTime: false,
      formulas: [],
      timeBoundOptions: ["Interval", "Lower", "Upper"],
      upperTimeBoundOptions: ["none", "Upper"],
      probabilityBoundOptions: ["GreaterEqual", "Greater", "LowerEqual", "Lower"],
      showCopyFeedback: false,
      componentKey: 0,
      jsonData: null,
      importErrorMessage: null,
      transformationPerformed: false,
      useNames: true,
      listenerAssistant: {
        isOpen: false,
        eventOptions: {
          eventName: ""
        }
      },
      commandAssistant: {
        type: null, isOpen: false,
        killOptions: {
          targetServiceName: "",
          instanceCountActive: false,
          instanceCount: "",
          eventNameActive: false,
          eventName: ""
        }, loadOptions: {
          startTime: "",
          endTime: "",
          factor: "",
          function: "",
          targetServiceName: "",
          targetEndpointName: ""
        }
      },
    };
  },
  watch: {
    'pspSpecification.selectedScope': {
      handler() {
        this.handleInputChange()
      },
      deep: true
    },
    'pspSpecification.selectedPatternType': {
      handler() {
        this.handleInputChange()
        this.handleTypeChange()
      },
      deep: true
    },
    'pspSpecification.selectedOccurrence': {
      handler() {
        this.handleInputChange()
        this.handleOccurrenceChange()
      },
      deep: true
    },
    checkedProbability: {
      handler() {
        this.handleInputChange()
        this.handleProbabilityChange()
      },
      deep: true
    },
    'pspSpecification.selectedProbabilityBound': {
      handler() {
        this.handleInputChange()
      },
      deep: true
    },
    'pspSpecification.probability': {
      handler() {
        this.checkProbability()
        this.handleInputChange()
      },
      deep: true
    },
    checkedTime: {
      handler() {
        this.handleTimeChange()
        this.handleInputChange()
      },
      deep: true
    },
    "pspSpecification.selectedTimeBound": {
      handler() {
        this.handleLimitChange()
        this.handleInputChange()
      },
      deep: true
    },
    "pspSpecification.upperLimit": {
      handler() {
        this.handleInputChange()
      },
      deep: true
    },
    "pspSpecification.timeUnit": {
      handler() {
        this.handleInputChange()
      },
      deep: true
    },
    "pspSpecification.lowerLimit": {
      handler() {
        this.handleInputChange()
      },
      deep: true
    },
    "customPredicateName": {
      handler() {
        this.handleInputChange()
      },
      deep: true
    },
    "customPredicateLogic": {
      handler() {
        this.handleInputChange()
      },
      deep: true
    },
    "customMeasurementSource": {
      handler() {
        this.handleInputChange()
      },
      deep: true
    },
    "customPredicateComparisonValue": {
      handler() {
        this.handleComparisonInputChange()
      },
      deep: true
    },
    "eventToChange": {
      handler() {
        this.eventToChangeSelected()
      },
      deep: true
    },
    "changedPredicateName": {
      handler() {
        this.handleInputChange()
      },
      deep: true
    },
    "changedPredicateLogic": {
      handler() {
        this.handleInputChange()
      },
      deep: true
    },
    "changedMeasurementSource": {
      handler() {
        this.handleInputChange()
      },
      deep: true
    },
    "changedPredicateComparisonValue": {
      handler() {
        this.handleComparisonInputChange()
      },
      deep: true
    },
    "customCommandName": {
      handler() {
        this.handleInputChange()
      },
      deep: true
    },
    "customCommandContent": {
      handler() {
        this.handleInputChange()
      },
      deep: true
    },
    "commandToChange": {
      handler() {
        this.commandToChangeSelected()
      },
      deep: true
    },
    "changedCommandName": {
      handler() {
        this.handleInputChange()
      },
      deep: true
    },
    "changedCommandContent": {
      handler() {
        this.handleInputChange()
      },
      deep: true
    },
    "customListenerName": {
      handler() {
        this.handleInputChange()
      },
      deep: true
    },
    "customListenerContent": {
      handler() {
        this.handleInputChange()
      },
      deep: true
    },
    "listenerToChange": {
      handler() {
        this.listenerToChangeSelected()
      },
      deep: true
    },
    "changedListenerName": {
      handler() {
        this.handleInputChange()
      },
      deep: true
    },
    "changedListenerContent": {
      handler() {
        this.handleInputChange()
      },
      deep: true
    },
    "pspSpecification.selectedScopeEventR": {
      handler() {
        this.handleInputChange()
      },
      deep: true
    },
    "pspSpecification.selectedScopeEventQ": {
      handler() {
        this.handleInputChange()
      },
      deep: true
    },
    "pspSpecification.selectedEventP": {
      handler() {
        this.handleInputChange()
      },
      deep: true
    },
    "pspSpecification.selectedEventS": {
      handler() {
        this.handleInputChange()
      },
      deep: true
    },
    "pspSpecification.selectedConstraintEvent": {
      handler() {
        this.handleInputChange()
      },
      deep: true
    },
    "pspSpecification.selectedChainedEvents": {
      handler() {
        this.handleInputChange()
      },
      deep: true
    },
    "pspSpecification.selectedInterval": {
      handler() {
        this.handleInputChange()
      },
      deep: true
    },
    "pspSpecification.selectedTime": {
      handler() {
        this.handleInputChange()
      },
      deep: true
    },
    "pspSpecification.selectedTimeUnitType": {
      handler() {
        this.handleInputChange()
      },
      deep: true
    },
    "pspSpecification.selectedTargetLogic": {
      handler() {
        this.handleInputChange()
      },
      deep: true
    },
    "useNames": {
      handler() {
        this.handleInputChange()
      },
      deep: true
    }
  },
  computed: {
    predicates: function () {
      let predicates = []
      if (this.type === 'response') {
        for (let event of this.state.events) {
          predicates.push(event.predicate_name)
        }
      }
      if (this.type === 'stimulus') {
        for (let command of this.state.commands) {
          predicates.push(command.command_name)
        }
        for (let listener of this.state.listeners) {
          predicates.push(listener.listener_name)
        }
      }
      return predicates
    }
    ,
    constraintPredicates: function () {
      let constraintPredicates = [...this.predicates]
      constraintPredicates.push("Constraint")
      return constraintPredicates
    }
    ,
    extendedTimeBoundOptions: function () {
      let extendedTimeBoundOptions = [...this.timeBoundOptions]
      extendedTimeBoundOptions.push("none")
      return extendedTimeBoundOptions
    }
    ,
    displayPredicateLogics() {
      // Map technical names to better display names
      const logicMap = {
        'equal': "Equal",
        'smallerEqual': "Smaller or equal",
        'smaller': "Smaller",
        'biggerEqual': "Greater or equal",
        'bigger': "Greater",
        'trendUpward': "Trend upward",
        'trendUpwardStrict': "Trend upward strict",
        'trendDownward': "Trend downward",
        'trendDownwardStrict': "Trend downward strict"
      };

      // Create an array of objects with label and value properties
      return this.predicateLogicOptions.map(logic => ({label: logicMap[logic], value: logic}));
    }
    ,
    displayScopes() {
      // Map technical names to better display names
      const scopeMap = {
        "Globally": "Globally",
        "BeforeR": "Before R",
        "AfterQ": "After Q",
        "BetweenQandR": "Between Q and R",
        "AfterQUntilR": "After Q Until R"
      };

      // Create an array of objects with label and value properties
      return this.scopeOptions.map(scope => ({label: scopeMap[scope], value: scope}));
    }
    ,
    displayOccurrenceOptions() {
      const occurenceMap = {
        "SteadyState": "Steady State",
        "MinimumDuration": "Minimum Duration",
        "MaximumDuration": "Maximum Duration",
        "Recurrence": "Recurrence",
        "Universality": "Universality",
        "Absence": "Absence",
        "Existence": "Existence",
        "BoundedExistence": "Bounded Existence",
        "TransientState": "Transient State",
      };
      return this.occurrenceOptions.map(option => ({label: occurenceMap[option], value: option}));
    }
    ,
    displayOrderOptions() {
      const orderMap = {
        "Response": "Response",
        "ResponseChain1N": "Response Chain 1N",
        "ResponseChainN1": "Response Chain N1",
        "ResponseInvariance": "Response Invariance",
        "Precedence": "Precedence",
        "PrecedenceChain1N": "Precedence Chain 1N",
        "PrecedenceChainN1": "Precedence Chain N1",
        "Until": "Until"
      };
      return this.orderOptions.map(option => ({label: orderMap[option], value: option}));
    }
    ,
    timeboundShouldGrayOut() {
      return !(this.pspSpecification.selectedPatternType === 'Order' ||
          this.pspSpecification.selectedOccurrence === 'Universality' ||
          this.pspSpecification.selectedOccurrence === 'Absence' ||
          this.pspSpecification.selectedOccurrence === 'Existence' ||
          this.pspSpecification.selectedOccurrence === 'BoundedExistence');
    }
    ,
    comparisonValueShouldGrayOut() {
      return !(this.customPredicateLogic === "bigger" ||
          this.customPredicateLogic === "biggerEqual" ||
          this.customPredicateLogic === "smaller" ||
          this.customPredicateLogic === "smallerEqual" ||
          this.customPredicateLogic === "equal");
    }
    ,
    comparisonValueShouldGrayOutEdit() {
      return !(this.changedPredicateLogic === "bigger" ||
          this.changedPredicateLogic === "biggerEqual" ||
          this.changedPredicateLogic === "smaller" ||
          this.changedPredicateLogic === "smallerEqual" ||
          this.changedPredicateLogic === "equal");
    }
    ,
  }
  ,
  setup() {
    const state = reactive({
      events: [],
      commands: [],
      listeners: [],
    });

    onMounted(async () => {
      state.events = await allEvents();
    });
    onMounted(async () => {
      state.commands = await allCommands();
    });
    onMounted(async () => {
      state.listeners = await allListeners()
    });
    onMounted(async () => {
      preparePopups();
    });

    return {
      state,
    };
  }
  ,
  methods: {
    toScenarioEditor,
    async initFields() {
      this.scenario = await getScenario(this.simID);
      const scenario = this.scenario
      if (typeof scenario.specification.measurementSources !== "undefined") {
        this.measurementSourceOptions = scenario.specification.measurementSources
      }
    }
    ,
    cancelListenerAssistant() {
      this.listenerAssistant.type = "";
      this.listenerAssistant.eventOptions.eventName = ""
      this.listenerAssistant.isOpen = false
    },
    applyListenerAssistant() {
      let listener = "";
      switch (this.listenerAssistant.type) {
        case "event":
          listener = this.buildEventListener();
          break;
      }
      this.customListenerContent = listener;
      this.cancelListenerAssistant();
    },
    buildEventListener() {
      let listener = "(event["
      listener += this.listenerAssistant.eventOptions.eventName.trim()
      listener += "])"
      return listener;
    },
    cancelCommandAssistant() {
      this.commandAssistant.type = "";
      this.commandAssistant.killOptions.instanceCountActive = false
      this.commandAssistant.killOptions.eventNameActive = false
      this.commandAssistant.killOptions.targetServiceName = ""
      this.commandAssistant.killOptions.instanceCount = ""
      this.commandAssistant.killOptions.eventName = ""
      this.commandAssistant.loadOptions.endTime = ""
      this.commandAssistant.loadOptions.startTime = ""
      this.commandAssistant.loadOptions.targetEndpointName = ""
      this.commandAssistant.loadOptions.factor = ""
      this.commandAssistant.loadOptions.function = ""
      this.commandAssistant.isOpen = false
    },
    applyCommandAssistant() {
      let command = "";
      switch (this.commandAssistant.type) {
        case "kill":
          command = this.buildKillCommand();
          break;
        case "load":
          command = this.buildLoadCommand();
          break;
      }
      this.customCommandContent = command;
      this.cancelCommandAssistant();
    },
    buildKillCommand() {
      let command = "(kill["
      command += this.commandAssistant.killOptions.targetServiceName.trim()
      if (this.commandAssistant.killOptions.instanceCountActive) {
        command += ","
        command += this.commandAssistant.killOptions.instanceCount.trim()
      }
      command += "])"
      if (this.commandAssistant.killOptions.eventNameActive) {
        command += " & (event["
        command += this.commandAssistant.killOptions.eventName.trim()
        command += "])"
      }
      return command;
    },
    buildLoadCommand() {
      let command = "(load["
      command += this.commandAssistant.loadOptions.startTime.trim()
      command += ","
      command += this.commandAssistant.loadOptions.endTime.trim()
      command += "][x"
      command += this.commandAssistant.loadOptions.factor.trim()
      command += ":"
      command += this.commandAssistant.loadOptions.function.trim()
      command += ":"
      command += this.commandAssistant.loadOptions.targetEndpointName.trim()
      command += "])"
      return command
    },
    /**
     * Creates a scope object with the given parameters.
     *
     * @param {string} selectedScope - The selected scope type.
     * @param {string} selectedScopeEventQ - The selected Q event for the scope.
     * @param {string} selectedScopeEventR - The selected R event for the scope.
     *
     * @param useNames - Whether the pattern should be filled with the human-readable event names.
     * @return {Object} - The created scope object.
     */
    createScope(selectedScope, selectedScopeEventQ, selectedScopeEventR, useNames) {
      const scope = {
        type: selectedScope
      };

      // include q_event if it exists
      if (selectedScopeEventQ && selectedScopeEventQ.trim() !== "") {
        scope.q_event = this.createEvent(selectedScopeEventQ, useNames);
      }

      // include r_event if it exists
      if (selectedScopeEventR && selectedScopeEventR.trim() !== "") {
        scope.r_event = this.createEvent(selectedScopeEventR, useNames);
      }

      return scope;
    }
    ,

// creates the time_bound part of the payload
    createTimeBound(type, timeUnit, upperLimit, lowerLimit) {
      return {
        type: type,
        time_unit: timeUnit,
        upper_limit: upperLimit,
        lower_limit: lowerLimit
      };
    }
    ,

// creates probability part of the payload
    createProbabilityBound(type, probability) {
      return {
        type: type,
        probability: probability
      };
    }
    ,

// creates the pattern part of the payload
    createPattern(selectedPatternType, selectedOccurrence, selectedOrder, selectedEventP, selectedEventS, selectedChainedEvents, selectedTime, selectedTimeUnitType, selectedInterval, selectedConstraintEvent, selectedTimeBound, selectedProbabilityBound, timeUnit, probability, upperLimit, lowerLimit, useNames) {
      const pattern = {
        type: selectedPatternType === 'Occurrence' ? selectedOccurrence : selectedOrder,
        p_event: this.createEvent(selectedEventP, useNames)
      };

      // include s_event if exists
      if (selectedEventS && selectedEventS.trim() !== "") {
        pattern.s_event = this.createEvent(selectedEventS, useNames)
      }

      // include chained_events if one exists
      if (!selectedChainedEvents.isEmpty) {
        pattern.chained_events = selectedChainedEvents.map(chainedEvent => {

          let ch_event = {
            // event is required
            event: this.createEvent(chainedEvent.event.name, useNames),
          };

          // constrain_event is optional
          if (chainedEvent.constrain_event && chainedEvent.constrain_event.name !== "Constraint") {
            ch_event.constrain_event = this.createEvent(chainedEvent.constrain_event.name, useNames)
          }

          // time_bound is optional
          if (chainedEvent.time_bound && chainedEvent.time_bound.type !== "none") {
            ch_event.time_bound = {
              type: chainedEvent.time_bound.type,
              lower_limit: chainedEvent.time_bound.lower_limit,
              upper_limit: chainedEvent.time_bound.upper_limit,
              time_unit: chainedEvent.time_bound.time_unit
            }
          }

          return ch_event
        });
      }

      // include pattern_specifications if one exists
      if (selectedTime || selectedInterval) {
        pattern.pattern_specifications = {
          time_unit: selectedTimeUnitType
        };
        // time and interval need to be 0 if not instantiated (not null)
        if (selectedTime) {
          pattern.pattern_specifications.upper_limit = selectedTime
        } else {
          pattern.pattern_specifications.upper_limit = 0
        }
        if (selectedInterval) {
          pattern.pattern_specifications.frequency = selectedInterval
        } else {
          pattern.pattern_specifications.frequency = 0
        }
      }

      // include pattern_constrains if one exists (Response always needs constrainEvent) ((selectedConstraintEvent && selectedConstraintEvent != "Constraint") || )
      if (selectedProbabilityBound || selectedTimeBound || (selectedConstraintEvent && selectedConstraintEvent !== "Constraint")) {
        pattern.pattern_constrains = {}

        if (selectedProbabilityBound !== null && probability !== null) {
          if (selectedTimeBound !== null && upperLimit !== null && lowerLimit !== null) {
            pattern.pattern_constrains = {
              time_bound: this.createTimeBound(selectedTimeBound, timeUnit, upperLimit, lowerLimit),
              probability_bound: this.createProbabilityBound(selectedProbabilityBound, probability),
            };
          } else if (selectedTimeBound !== null && upperLimit === null && lowerLimit !== null) {
            pattern.pattern_constrains = {
              time_bound: this.createTimeBound(selectedTimeBound, timeUnit, 0, lowerLimit),
              probability_bound: this.createProbabilityBound(selectedProbabilityBound, probability),
            };
          } else if (selectedTimeBound !== null && upperLimit !== null && lowerLimit === null) {
            pattern.pattern_constrains = {
              time_bound: this.createTimeBound(selectedTimeBound, timeUnit, upperLimit, 0),
              probability_bound: this.createProbabilityBound(selectedProbabilityBound, probability),
            };
          } else {
            pattern.pattern_constrains = {
              probability_bound: this.createProbabilityBound(selectedProbabilityBound, probability),
            };
          }
        } else if (selectedProbabilityBound === null || probability === null) {
          if (selectedTimeBound !== null && upperLimit !== null && lowerLimit !== null) {
            pattern.pattern_constrains = {
              time_bound: this.createTimeBound(selectedTimeBound, timeUnit, upperLimit, lowerLimit),
            };
          } else if (selectedTimeBound !== null && upperLimit === null && lowerLimit !== null) {
            pattern.pattern_constrains = {
              time_bound: this.createTimeBound(selectedTimeBound, timeUnit, 0, lowerLimit),
            };
          } else if (selectedTimeBound !== null && upperLimit !== null && lowerLimit === null) {
            pattern.pattern_constrains = {
              time_bound: this.createTimeBound(selectedTimeBound, timeUnit, upperLimit, 0),
            };
          }
        }

        if (selectedConstraintEvent && selectedConstraintEvent !== "Constraint") {
          pattern.pattern_constrains.constrain_event = this.createEvent(selectedConstraintEvent, useNames)
        }
      }

      return pattern;
    }
    ,

// creates the payload
    createPayload(selectedScope, selectedScopeEventQ, selectedScopeEventR, selectionPatternType, selectedOccurrence, selectedOrder, selectedEventP, selectedEventS, selectedChainedEvents, selectedTime, selectedTimeUnitType, selectedInterval, selectedConstraintEvent, selectedTargetLogic, selectedTimeBound, selectedProbabilityBound, timeUnit, probability, upperLimit, lowerLimit, useNames = false) {
      return {
        scope: this.createScope(selectedScope, selectedScopeEventQ, selectedScopeEventR, useNames),
        pattern: this.createPattern(selectionPatternType, selectedOccurrence, selectedOrder, selectedEventP, selectedEventS, selectedChainedEvents, selectedTime, selectedTimeUnitType, selectedInterval, selectedConstraintEvent, selectedTimeBound, selectedProbabilityBound, timeUnit, probability, upperLimit, lowerLimit, useNames),
        target_logic: selectedTargetLogic
      };
    }
    ,
// creates the event part of the payload. Takes the predicate from the events-array based on the event name
    /**
     * Creates an event object with the given name from an array of events.
     *
     * @param {string} name - The name of the event to create.
     *
     * @param useNames - Whether human-readable names should be used instead of the concrete specification.
     * @return {Object} - An event object with the specified name and associated specification.
     *                   The event object has the following properties:
     *                   - name: The name of the event.
     *                   - specification: An object containing the specifications of the event,
     *                     including the predicate name, logic, comparison value, and measurement source.
     */
    createEvent(name, useNames) {
      if (this.type === "response") {
        const event = this.state.events.find(event => event.predicate_name === name);
        if (event === undefined) {
          return
        }
        return {
          name: useNames ? event.predicate_name : event.event_name,
          specification: {
            predicateName: event.predicate_name,
            predicateLogic: event.predicate_logic,
            predicateComparisonValue: event.predicate_comparison_value,
            measurementSource: event.measurement_source
          }
        };
      }
      if (this.type === "stimulus") {
        const command = this.state.commands.find(command => command.command_name === name);
        if (command === undefined) {
          const listener = this.state.listeners.find(listener => listener.listener_name === name);
          if (listener === undefined) {
            return
          }
          // send mock specification as it is not used anyway
          return {
            name: useNames ? listener.listener_name : listener.listener_content,
            specification: {
              predicateName: listener.listener_name,
              predicateLogic: listener.listener_name,
              predicateComparisonValue: listener.listener_name,
              measurementSource: listener.listener_name
            }
          }
        } else {
          // send mock specification as it is not used anyway
          return {
            name: useNames ? command.command_name : command.command_content,
            specification: {
              predicateName: command.command_name,
              predicateLogic: command.command_name,
              predicateComparisonValue: command.command_name,
              measurementSource: command.command_name
            }
          };
        }
      }
    }
    ,
    resetAllFields() {
      this.pspSpecification = {
        selectedPatternType: null,
        selectedScope: null,
        selectedOccurrence: null,
        selectedOrder: null,
        selectedScopeEventQ: null,
        selectedScopeEventR: null,
        selectedEventP: null,
        selectedEventS: null,
        selectedChainedEvents: [],
        selectedConstraintEvent: "Constraint",
        selectedTime: null,
        selectedInterval: null,
        selectedTimeUnitType: "time units",
        selectedTargetLogic: "SEL",
        mapping: null,
        selectedTimeBound: null,
        selectedProbabilityBound: null,
        upperLimit: null,
        lowerLimit: null,
        probability: null,
        timeUnit: "time units",
        interval: ["Interval"]
      }
      this.events = [{
        eventName: "",
        predicate: {
          predicate_name: "A",
          predicate_logic: "biggerEqual",
          predicate_comparison_value: "100",
          measurement_source: "resp_time_high"
        }
      }]
      this.checkedProbability = false
      this.checkedTime = false
    }
    ,
    async addValue(field, newValue) {
      await pushScenarioField(this.simID, field, newValue)
    }
    ,
    handleOccurrenceChange() {
      // Reset selected event when occurrence changes
      this.pspSpecification.selectedEvent = null;
    }
    ,
    handleTypeChange() {
      // Reset preview when pattern type changes
      this.pspSpecification.selectedOccurrence = null;
      this.pspSpecification.selectedOrder = null;
    }
    ,
    async addCustomMeasurementSource() {
      if (this.newMeasurementSource.trim() !== "" && !this.measurementSourceOptions.includes(this.newMeasurementSource.trim())) {
        this.measurementSourceOptions.push(this.newMeasurementSource.trim())
        await this.addValue("specification.measurementSources", this.newMeasurementSource)
        if (this.customMeasurementSource.trim() === "") { // set as current selected
          this.customMeasurementSource = this.newMeasurementSource
        }
        this.newMeasurementSource = "" // reset
      }
    }
    ,
    async addCustomEvent() {
      let trimmedName = this.customPredicateName.trim()
      // Add the custom event to the list if it is not empty
      if (trimmedName !== "") {
        if (this.eventNameExists(trimmedName)) {
          await failureMessage("Failure", "Name " + trimmedName + " already exists. Please choose another name.")
          return
        }

        // write the event to the mongodb database
        const body = {
          event_name: this.customPredicateName + "(" + this.customMeasurementSource + ")",
          predicate_name: this.customPredicateName,
          predicate_logic: this.customPredicateLogic,
          predicate_comparison_value: this.customPredicateComparisonValue,
          measurement_source: this.customMeasurementSource,
        }
        await saveEvent(body)

        // also add this event to the local event array
        this.state.events = await allEvents();

        // clear the input fields after adding the custom event
        this.customPredicateName = "";
        this.customPredicateLogic = "";
        this.customPredicateComparisonValue = "";
        this.customMeasurementSource = "";

        await successMessage("Added Event", "The event " + body.customPredicateName + " has been added successfully")
      }
    }
    ,
    async addCustomCommand() {
      let trimmedName = this.customCommandName.trim()
      // Add the custom command to the list if it is not empty
      if (trimmedName !== "") {
        if (this.commandNameExists(trimmedName) || this.listenerNameExists(trimmedName)) {
          await failureMessage("Failure", "Name " + trimmedName + " already exists. Please choose another name.")
          return
        }

        // write the event to the mongodb database
        const body = {
          command_name: this.customCommandName,
          command_content: this.customCommandContent,
        }
        await saveCommand(body);

        // also add this event to the local event array
        this.state.commands = await allCommands();

        // clear the input fields after adding the custom event
        this.customCommandName = "";
        this.customCommandContent = "";

        await successMessage("Added Command", "The command " + body.command_name + " has been added successfully")
      }
    }
    ,
    listenerNameExists(name) {
      for (let listener of this.state.listeners) {
        if (listener.listener_name.trim() === name) {
          return true
        }
      }
      return false
    }
    ,
    commandNameExists(name) {
      for (let command of this.state.commands) {
        if (command.command_name.trim() === name) {
          return true
        }
      }
      return false
    }
    ,
    eventNameExists(name) {
      for (let event of this.state.events) {
        if (event.predicate_name.trim() === name) {
          return true
        }
      }
      return false
    }
    ,
    async addCustomListener() {
      // Add the custom event to the list if it is not empty
      let trimmedName = this.customListenerName.trim()
      if (trimmedName !== "") {
        if (this.commandNameExists(trimmedName) || this.listenerNameExists(trimmedName)) {
          await failureMessage("Failure", "Name " + trimmedName + " already exists. Please choose another name.")
          return
        }

        // write the event to the mongodb database
        const body = {
          listener_name: this.customListenerName,
          listener_content: this.customListenerContent,
        }
        await saveListener(body)

        // also add this event to the local event array
        this.state.listeners = await allListeners();

        // clear the input fields after adding the custom event
        this.customListenerName = "";
        this.customListenerContent = "";

        await successMessage("Added Listener", "The listener " + body.listener_name + " has been added successfully")
      }
    }
    ,
    handleComparisonInputChange() {
      // remove non-numeric characters from the input
      if (this.customPredicateComparisonValue !== undefined) {
        this.customPredicateComparisonValue = this.customPredicateComparisonValue.replace(/\D/g, '');
      }
      if (this.changedPredicateComparisonValue !== undefined) {
        this.changedPredicateComparisonValue = this.changedPredicateComparisonValue.replace(/\D/g, '');
      }

      this.handleInputChange();
    }
    ,
    eventToChangeSelected() {
      setTimeout(this.setEventChangeFields, 200)
    }
    ,
    async setEventChangeFields() {
      this.changedEventId = this.eventToChange._id;

      this.changedPredicateName = this.eventToChange.predicate_name
      this.changedPredicateLogic = this.eventToChange.predicate_logic
      this.changedPredicateComparisonValue = this.eventToChange.predicate_comparison_value
      this.changedMeasurementSource = this.eventToChange.measurement_source

      this.forceRerender()
      this.handleInputChange()
    }
    ,
    commandToChangeSelected() {
      setTimeout(this.setCommandChangeFields, 200)
    }
    ,
    async setCommandChangeFields() {
      this.changedCommandId = this.commandToChange._id;

      this.changedCommandName = this.commandToChange.command_name
      this.changedCommandContent = this.commandToChange.command_content

      this.forceRerender()
      this.handleInputChange()
    }
    ,
    listenerToChangeSelected() {
      setTimeout(this.setListenerChangeFields, 200)
    }
    ,
    async setListenerChangeFields() {
      this.changedListenerId = this.listenerToChange._id;

      this.changedListenerName = this.listenerToChange.listener_name
      this.changedListenerContent = this.listenerToChange.listener_content

      this.forceRerender()
      this.handleInputChange()
    }
    ,
    async changeEvent() {
      let trimmedName = this.changedPredicateName.trim()
      if (this.eventNameExists(trimmedName)) {
        await failureMessage("Failure", "Name " + trimmedName + " already exists. Please choose another name.")
        return
      }

      // write the event to the mongodb database
      const body = {
        _id: this.eventToChange._id,
        event_name: this.changedPredicateName + "(" + this.changedMeasurementSource + ")",
        predicate_name: this.changedPredicateName,
        predicate_logic: this.changedPredicateLogic,
        predicate_comparison_value: this.changedPredicateComparisonValue,
        measurement_source: this.changedMeasurementSource,
      }
      await changeEvent(body);

      // also add this event to the local event array
      this.state.events = await allEvents();

      // clear the input fields after adding the custom event
      this.changedPredicateName = "";
      this.changedPredicateLogic = "";
      this.changedPredicateComparisonValue = "";
      this.changedMeasurementSource = "";
      await successMessage("Changed Event", "The event " + body.customPredicateName + " has been changed successfully")
    }
    ,
    async changeCommand() {
      let trimmedName = this.changedCommandName.trim()
      if (this.commandNameExists(trimmedName) || this.listenerNameExists(trimmedName)) {
        await failureMessage("Failure", "Name " + trimmedName + " already exists. Please choose another name.")
        return
      }

      // write the command to the mongodb database
      const body = {
        _id: this.commandToChange._id,
        command_name: this.changedCommandName,
        command_content: this.changedCommandContent,
      }
      await changeCommand(body)

      // also add this command to the local command array
      this.state.commands = await allCommands();

      // clear the input fields after adding the custom command
      this.changedCommandName = "";
      this.changedCommandContent = "";

      await successMessage("Changed Command", "The command " + body.command_name + " has been changed successfully")
    }
    ,
    async changeListener() {
      let trimmedName = this.changedListenerName.trim()
      if (this.commandNameExists(trimmedName) || this.listenerNameExists(trimmedName)) {
        await failureMessage("Failure", "Name " + trimmedName + " already exists. Please choose another name.")
        return
      }

      // write the listener to the mongodb database
      const body = {
        _id: this.listenerToChange._id,
        listener_name: this.changedListenerName,
        listener_content: this.changedListenerContent,
      }
      await changeListener(body);

      // also add this listener to the local listener array
      this.state.listeners = await allListeners()

      // clear the input fields after adding the custom listener
      this.changedListenerName = "";
      this.changedListenerContent = "";

      await successMessage("Changed Listener", "The listener " + body.listener_name + " has been changed successfully")
    }
    ,
    async deleteEvent() {
      // delete the event from the mongodb database
      await deleteEvent(this.eventToChange._id)

      // also add this event to the local event array
      this.state.events = await allEvents()

      await successMessage("Deleted Event", "The event " + this.eventToChange.event_name + " has been deleted")

      // clear the input fields after adding the custom event
      this.changedPredicateName = "";
      this.changedPredicateLogic = "";
      this.changedPredicateComparisonValue = "";
      this.changedMeasurementSource = "";
    }
    ,
    async deleteCommand() {
      // delete the command from the mongodb database
      await deleteCommand(this.commandToChange._id)

      // also add this event to the local command array
      this.state.commands = await allCommands();

      await successMessage("Deleted Command", "The command " + this.commandToChange.command_name + " has been deleted")

      // clear the input fields after adding the custom command
      this.changedCommandName = "";
      this.changedCommandContent = "";
    }
    ,
    async deleteListener() {
      // delete the listener from the mongodb database
      await deleteListener(this.listenerToChange._id)

      await successMessage("Deleted Listener", "The listener " + this.listenerToChange.listener_name + " has been deleted")

      // also add this listener to the local listener array
      this.state.listeners = await allListeners();

      // clear the input fields after adding the custom event
      this.changedListenerName = "";
      this.changedListenerContent = "";
    }
    ,
    async deleteMeasurementSource() {
      const deleteIndex = this.measurementSourceOptions.indexOf(this.deleteMarkedMeasurementSource)
      // delete mongodb database
      await deleteScenarioField(this.simID, "specification.measurementSources", deleteIndex);

      // also delete from the local array
      this.measurementSourceOptions.splice(deleteIndex, 1)
    }
    ,
    handleProbabilityChange() {
      // Reset probabilityBound and probability when unchecked
      this.pspSpecification.selectedProbabilityBound = null;
      this.pspSpecification.probability = null;
    }
    ,
    handleTimeChange() {
      // Reset timeBound and timUnit when unchecked
      this.pspSpecification.selectedTimeBound = null;
      this.pspSpecification.timeUnit = "time units";
    }
    ,
    handleLimitChange() {
      // Reset limits when timeBound changes
      this.pspSpecification.upperLimit = null;
      this.pspSpecification.lowerLimit = null;
    }
    ,
    checkProbability() {
      //Checks if probability is between 0 and 1
      if (this.pspSpecification.probability < 0) {
        this.pspSpecification.probability = 0;
      } else if (this.pspSpecification.probability > 1) {
        this.pspSpecification.probability = 1;
      }
    }
    ,
    async sendTransformRequest(payload) {
      if (payload.scope.type === null || payload.pattern.type === null || payload.pattern.p_event === undefined) {
        return
      }
      payload = JSON.stringify(payload)
      try {
        const response = await getPSPMapping(payload);
        const responsePayload = await response.data.value.result

        // if mapping is returned, display it, else display the error message
        if (responsePayload.payload.mapping) {
          this.pspSpecification.mapping = responsePayload.payload.mapping
        } else {
          this.pspSpecification.mapping = responsePayload.payload.error
        }
        this.transformationPerformed = true
        this.forceRerender()

      } catch (error) {
        // Handle any errors that occur during the HTTP request
        this.transformationPerformed = false
        console.error('Error transforming to temporal logic:', error);
      }
    }
    ,
    async transformToTemporalLogic() {
      const payload = this.createPayload(this.pspSpecification.selectedScope, this.pspSpecification.selectedScopeEventQ, this.pspSpecification.selectedScopeEventR, this.pspSpecification.selectedPatternType, this.pspSpecification.selectedOccurrence, this.pspSpecification.selectedOrder, this.pspSpecification.selectedEventP, this.pspSpecification.selectedEventS, this.pspSpecification.selectedChainedEvents, this.pspSpecification.selectedTime, this.pspSpecification.selectedTimeUnitType, this.pspSpecification.selectedInterval, this.pspSpecification.selectedConstraintEvent, this.pspSpecification.selectedTargetLogic, this.pspSpecification.selectedTimeBound, this.pspSpecification.selectedProbabilityBound, this.pspSpecification.timeUnit, this.pspSpecification.probability, this.pspSpecification.upperLimit, this.pspSpecification.lowerLimit, this.useNames);
      await this.sendTransformRequest(payload)
      this.forceRerender()
    }
    ,
    handleInputChange() {
      setTimeout(this.transformToTemporalLogic, 100)
    }
    ,
    copyToClipboard() {
      const textarea = document.createElement("textarea");
      textarea.value = this.pspSpecification.mapping;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);

      // Shortly show copy feedback message
      this.showCopyFeedback = true;
      setTimeout(() => {
        this.showCopyFeedback = false;
      }, 2000);
    }
    ,
    addChainedEvent() {
      this.pspSpecification.selectedChainedEvents.push({
        event: {},
        constrain_event: {
          name: "Constraint"
        },
        time_bound: {
          type: "none",
          time_unit: "time units"
        }
      });
      this.forceRerender()
    }
    ,
    deleteChainedEvent(index) {
      if (index >= 0 && index < this.pspSpecification.selectedChainedEvents.length) {
        this.pspSpecification.selectedChainedEvents.splice(index, 1);
      } else {
        console.log("Error deleting the chained event");
      }
      this.handleInputChange()
    }
    ,
    // used for the specification import
    handleFileChange() {
      const fileInput = this.$refs.fileInput;

      if (!fileInput.files.length) {
        console.warn('No file selected');
        return;
      }

      const file = fileInput.files[0];
      const fileReader = new FileReader();

      fileReader.onload = async () => {
        try {
          const jsonData = JSON.parse(fileReader.result);
          this.jsonData = JSON.stringify(jsonData, null, 2);

          // reset all fields
          this.resetAllFields()

          // scope
          this.pspSpecification.selectedScope = jsonData.scope.type
          if (jsonData.scope.q_event && jsonData.scope.q_event.name) {
            // write the event to the mongodb database
            const body = {
              event_name: jsonData.scope.q_event.name,
              predicate_name: jsonData.scope.q_event.specification.predicateName,
              predicate_logic: jsonData.scope.q_event.specification.predicateLogic,
              predicate_comparison_value: jsonData.scope.q_event.specification.predicateComparisonValue,
              measurement_source: jsonData.scope.q_event.specification.measurementSource,
            }
            await saveEvent(body);
            this.pspSpecification.selectedScopeEventQ = jsonData.scope.q_event.name
          }
          if (jsonData.scope.r_event && jsonData.scope.r_event.name) {
            // write the event to the mongodb database
            const body = {
              event_name: jsonData.scope.r_event.name,
              predicate_name: jsonData.scope.r_event.specification.predicateName,
              predicate_logic: jsonData.scope.r_event.specification.predicateLogic,
              predicate_comparison_value: jsonData.scope.r_event.specification.predicateComparisonValue,
              measurement_source: jsonData.scope.r_event.specification.measurementSource
            }
            await saveEvent(body);
            this.pspSpecification.selectedScopeEventR = jsonData.scope.r_event.name
          }
          // pattern type
          if (this.occurrenceOptions.includes(jsonData.pattern.type)) {
            this.pspSpecification.selectedPatternType = "Occurrence"
            this.pspSpecification.selectedOccurrence = jsonData.pattern.type
          } else {
            this.pspSpecification.selectedPatternType = "Order"
            this.pspSpecification.selectedOrder = jsonData.pattern.type
          }
          // main pattern events
          if (jsonData.pattern.p_event && jsonData.pattern.p_event.name) {
            // write the event to the mongodb database
            const body = {
              event_name: jsonData.pattern.p_event.name,
              predicate_name: jsonData.pattern.p_event.specification.predicateName,
              predicate_logic: jsonData.pattern.p_event.specification.predicateLogic,
              predicate_comparison_value: jsonData.pattern.p_event.specification.predicateComparisonValue,
              measurement_source: jsonData.pattern.p_event.specification.measurementSource
            }
            await saveEvent(body);
            this.pspSpecification.selectedEventP = jsonData.pattern.p_event.name
          }
          if (jsonData.pattern.s_event && jsonData.pattern.s_event.name) {
            // write the event to the mongodb database
            const body = {
              event_name: jsonData.pattern.s_event.name,
              predicate_name: jsonData.pattern.s_event.specification.predicateName,
              predicate_logic: jsonData.pattern.s_event.specification.predicateLogic,
              predicate_comparison_value: jsonData.pattern.s_event.specification.predicateComparisonValue,
              measurement_source: jsonData.pattern.s_event.specification.measurementSource
            }
            await saveEvent(body);
            this.pspSpecification.selectedEventS = jsonData.pattern.s_event.name
          }
          // pattern specifications
          if (jsonData.pattern.pattern_specifications) {
            if (jsonData.pattern.pattern_specifications.time_unit) {
              this.pspSpecification.selectedTimeUnitType = jsonData.pattern.pattern_specifications.time_unit
            }
            if (jsonData.pattern.pattern_specifications.upper_limit) {
              this.pspSpecification.selectedTime = jsonData.pattern.pattern_specifications.upper_limit
            }
            if (jsonData.pattern.pattern_specifications.frequency) {
              this.pspSpecification.selectedInterval = jsonData.pattern.pattern_specifications.frequency
            }
          }
          // pattern constraints
          if (jsonData.pattern.pattern_constrains) {
            if (jsonData.pattern.pattern_constrains.time_bound) {
              this.checkedTime = true
              this.pspSpecification.selectedTimeBound = jsonData.pattern.pattern_constrains.time_bound.type
              this.pspSpecification.timeUnit = jsonData.pattern.pattern_constrains.time_bound.time_unit
              this.pspSpecification.upperLimit = jsonData.pattern.pattern_constrains.time_bound.upper_limit
              if (jsonData.pattern.pattern_constrains.time_bound.lower_limit) {
                this.pspSpecification.lowerLimit = jsonData.pattern.pattern_constrains.time_bound.lower_limit
              }
            }
            if (jsonData.pattern.pattern_constrains.probability_bound) {
              this.checkedProbability = true
              this.pspSpecification.selectedProbabilityBound = jsonData.pattern.pattern_constrains.probability_bound.type
              this.pspSpecification.probability = jsonData.pattern.pattern_constrains.probability_bound.probability
            }
            if (jsonData.pattern.pattern_constrains.constrain_event) {
              // write the event to the mongodb database
              const body = {
                event_name: jsonData.pattern.pattern_constrains.constrain_event.name,
                predicate_name: jsonData.pattern.pattern_constrains.constrain_event.specification.predicateName,
                predicate_logic: jsonData.pattern.pattern_constrains.constrain_event.specification.predicateLogic,
                predicate_comparison_value: jsonData.pattern.pattern_constrains.constrain_event.specification.predicateComparisonValue,
                measurement_source: jsonData.pattern.pattern_constrains.constrain_event.specification.measurementSource
              }
              await saveEvent(body);
              this.pspSpecification.selectedConstraintEvent = jsonData.pattern.pattern_constrains.constrain_event.name
            }
          }
          // pattern chained events
          if (jsonData.pattern.chained_events && jsonData.pattern.chained_events.length > 0) {
            // for every chained event in array "chained_events"
            for (const chEventJson of jsonData.pattern.chained_events) {

              const chainedEvent = {}

              // event is required
              // write the event to the mongodb database
              const body = {
                event_name: chEventJson.event.name,
                predicate_name: chEventJson.event.specification.predicateName,
                predicate_logic: chEventJson.event.specification.predicateLogic,
                predicate_comparison_value: chEventJson.event.specification.predicateComparisonValue,
                measurement_source: chEventJson.event.specification.measurementSource
              }
              await saveEvent(body);
              chainedEvent.event = {
                name: chEventJson.event && chEventJson.event.name || "",
                specification: chEventJson.event && chEventJson.event.specification || ""
              }
              // constrain_event is optional
              if (chEventJson.constrain_event) {
                // write the event to the mongodb database
                const body = {
                  event_name: chEventJson.constrain_event.name,
                  predicate_name: chEventJson.constrain_event.specification.predicateName,
                  predicate_logic: chEventJson.constrain_event.specification.predicateLogic,
                  predicate_comparison_value: chEventJson.constrain_event.specification.predicateComparisonValue,
                  measurement_source: chEventJson.constrain_event.specification.measurementSource
                }
                await saveEvent(body);
                chainedEvent.constrain_event = {
                  name: chEventJson.constrain_event && chEventJson.constrain_event.name || "",
                  specification: chEventJson.constrain_event && chEventJson.constrain_event.specification || ""
                }
              }

              // time_bound is optional
              const timeBound = {};
              if (chEventJson.time_bound) {
                timeBound.type = chEventJson.time_bound.type || "none";
                if (chEventJson.time_bound.upper_limit !== null && chEventJson.time_bound.upper_limit !== undefined) {
                  timeBound.upper_limit = chEventJson.time_bound.upper_limit;
                }
                if (chEventJson.time_bound.lower_limit !== null && chEventJson.time_bound.lower_limit !== undefined) {
                  timeBound.lower_limit = chEventJson.time_bound.lower_limit;
                }
                timeBound.time_unit = chEventJson.time_bound.time_unit || "";
              } else {
                timeBound.type = "none"
              }
              chainedEvent.time_bound = timeBound
              this.pspSpecification.selectedChainedEvents.push(chainedEvent);
            }
          }
          // target logic
          this.pspSpecification.selectedTargetLogic = jsonData.target_logic

          // also add these events to the local event array
          this.state.events = await allEvents();

          await this.transformToTemporalLogic()

          this.importErrorMessage = null

        } catch (error) {
          // mapping not valid
          this.importErrorMessage = "The imported specification is not valid! \n Technical error message: \n " + error
          console.error('Error parsing JSON:', error);
        }
      };

      fileReader.readAsText(file);

      this.forceRerender()
    }
    ,
    // Save the mapping to the MongoDB Database and direct to the Scenario Editor
    async confirm() {
      let index;
      let responseObject = {
        SSEL: '',
        SEL: '',
        LTL: '',
        MTL: '',
        Prism: '',
        Quantitative_Prism: '',
        TBV_untimed: '',
        TBV_timed: '',
        target_logic: this.targetLogicOptions.indexOf(this.pspSpecification.selectedTargetLogic),
        predicates_info: []
      };

      const payloadWithNames = this.createPayload(this.pspSpecification.selectedScope, this.pspSpecification.selectedScopeEventQ, this.pspSpecification.selectedScopeEventR, this.pspSpecification.selectedPatternType, this.pspSpecification.selectedOccurrence, this.pspSpecification.selectedOrder, this.pspSpecification.selectedEventP, this.pspSpecification.selectedEventS, this.pspSpecification.selectedChainedEvents, this.pspSpecification.selectedTime, this.pspSpecification.selectedTimeUnitType, this.pspSpecification.selectedInterval, this.pspSpecification.selectedConstraintEvent, "SEL", this.pspSpecification.selectedTimeBound, this.pspSpecification.selectedProbabilityBound, this.pspSpecification.timeUnit, this.pspSpecification.probability, this.pspSpecification.upperLimit, this.pspSpecification.lowerLimit, true);
      const responseWithNames = await getPSPMapping(payloadWithNames);
      const responsePayloadWithNames = await responseWithNames.data.value.result
      responseObject.SSEL = responsePayloadWithNames.payload.mapping;

      // add all mappings to the commit
      for (index in this.targetLogicOptions) {
        const payload = this.createPayload(this.pspSpecification.selectedScope, this.pspSpecification.selectedScopeEventQ, this.pspSpecification.selectedScopeEventR, this.pspSpecification.selectedPatternType, this.pspSpecification.selectedOccurrence, this.pspSpecification.selectedOrder, this.pspSpecification.selectedEventP, this.pspSpecification.selectedEventS, this.pspSpecification.selectedChainedEvents, this.pspSpecification.selectedTime, this.pspSpecification.selectedTimeUnitType, this.pspSpecification.selectedInterval, this.pspSpecification.selectedConstraintEvent, this.targetLogicOptions[index], this.pspSpecification.selectedTimeBound, this.pspSpecification.selectedProbabilityBound, this.pspSpecification.timeUnit, this.pspSpecification.probability, this.pspSpecification.upperLimit, this.pspSpecification.lowerLimit);

        // Perform the HTTP request with the input data
        const response = await getPSPMapping(payload);
        const responsePayload = await response.data.value.result

        // if mapping is returned, display it, else display the error message
        if (responsePayload.payload.mapping) {
          switch (this.targetLogicOptions[index]) {
            case 'SEL':
              responseObject.SEL = responsePayload.payload.mapping;
              break;
            case 'LTL':
              responseObject.LTL = responsePayload.payload.mapping;
              break;
            case 'MTL':
              responseObject.MTL = responsePayload.payload.mapping;
              break;
            case 'Prism':
              responseObject.Prism = responsePayload.payload.mapping;
              break;
            case 'Quantitative Prism':
              responseObject.Quantitative_Prism = responsePayload.payload.mapping;
              break;
            case 'TBV (untimed)':
              responseObject.TBV_untimed = responsePayload.payload.mapping;
              break;
            case 'TBV (timed)':
              responseObject.TBV_timed = responsePayload.payload.mapping;
              break;
            default:
              console.log('This target logic doesnt exist');
          }
        }
      }

      // add predicates to commit
      const pl = this.createPayload(this.pspSpecification.selectedScope, this.pspSpecification.selectedScopeEventQ, this.pspSpecification.selectedScopeEventR, this.pspSpecification.selectedPatternType, this.pspSpecification.selectedOccurrence, this.pspSpecification.selectedOrder, this.pspSpecification.selectedEventP, this.pspSpecification.selectedEventS, this.pspSpecification.selectedChainedEvents, this.pspSpecification.selectedTime, this.pspSpecification.selectedTimeUnitType, this.pspSpecification.selectedInterval, this.pspSpecification.selectedConstraintEvent, this.targetLogicOptions[0], this.pspSpecification.selectedTimeBound, this.pspSpecification.selectedProbabilityBound, this.pspSpecification.timeUnit, this.pspSpecification.probability, this.pspSpecification.upperLimit, this.pspSpecification.lowerLimit);
      const response = await getPSPMapping(pl)
      const responsePayload = await response.data.value.result
      let eventArray = [];
      this.state.events.forEach(event => {
        if (responsePayload.payload.mapping.includes(event.predicate_name)) {
          eventArray.push({
            predicate_name: event.predicate_name,
            predicate_logic: event.predicate_logic,
            measurement_source: event.measurement_source,
            predicate_comparison_value: event.predicate_comparison_value
          });
        }
      });
      responseObject.predicates_info = eventArray;

      let type;
      switch (this.type) {
        case 'response':
          type = "responses"
          break;
        case 'stimulus':
          type = "stimuli"
          break;
        default:
          console.log("Unknown type: " + this.type)
      }
      await pushScenarioField(this.simID, type, responseObject)

      toScenarioEditor(this.simID, this.$router)
    }
    ,
    forceRerender() {
      this.componentKey += 1;
    }
  }
  ,
  beforeMount() {
    this.initFields()
  }
  ,
}
;
</script>

<template :key="componentKey">
  <div class="page-container">
    <div class="file-upload-container">
      <div class="file-upload">
        <div class="file-upload-button">
          <label for="fileInput" class="custom-file-upload">Import Specification</label>
          <input id="fileInput" type="file" ref="fileInput" @change="handleFileChange" style="display: none;">
        </div>
        <UTooltip text="Import a specification JSON matching the schema.">
          <div class="info-icon">
            <i>i</i>
          </div>
        </UTooltip>
        <div class="download-schema">
          <a href="/request_schema.json" download="">Download schema</a>
        </div>
      </div>
    </div>
    <div v-if="this.importErrorMessage">
      <pre class="import-error-text">{{ this.importErrorMessage }}</pre>
    </div>
  </div>

  <div class="page-container">
    <div class="selection-container">
      <div class="grouping-container">
        <UDivider label="Pattern Selection"></UDivider>

        <UTabs :items="patternItems" class="w-full">
          <template #item="{ item }">
            <UCard>
              <p class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                {{ item.label }}
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ item.description }}
              </p>

              <div v-if="item.key === 'scope'" class="selection-group">
                <USelectMenu v-model="this.pspSpecification.selectedScope" :options="displayScopes"
                             value-attribute="value"
                             option-attribute="label">
                </USelectMenu>
              </div>

              <div v-if="item.key === 'pattern'" class="selection-group">
                <div class="radio-group">
                  <URadioGroup v-model="this.pspSpecification.selectedPatternType" :options="this.patterTypeOptions"
                               :class="'breaking-div'"/>
                  <br/>
                </div>

                <div
                    v-if="this.pspSpecification.selectedPatternType !== 'Occurrence' && this.pspSpecification.selectedPatternType !== 'Order'"
                    class="selection-group">
                  <USelectMenu disabled placeholder="Select Type First"></USelectMenu>
                </div>

                <div v-if="this.pspSpecification.selectedPatternType === 'Occurrence'" class="selection-group">
                  <USelectMenu v-model="this.pspSpecification.selectedOccurrence" :options="displayOccurrenceOptions"
                               value-attribute="value"
                               option-attribute="label" searchable placeholder="Select Pattern">
                  </USelectMenu>
                </div>

                <div v-if="this.pspSpecification.selectedPatternType === 'Order'" class="selection-group">
                  <USelectMenu v-model="this.pspSpecification.selectedOrder" :options="displayOrderOptions"
                               value-attribute="value"
                               option-attribute="label" searchable placeholder="Select Pattern"/>
                </div>
              </div>

              <div v-if="item.key === 'probability-bound'" class="selection-group">
                <UCheckbox v-model="this.checkedProbability" class="center" name="Probability Bound"
                           label="Probability Bound"/>

                <div v-show="this.checkedProbability">
                  <br/>
                  <div class="container-row">
                    <div class="container-row-element  mr-1">
                      <label class="Type">Type:</label><br>
                      <USelectMenu v-model="this.pspSpecification.selectedProbabilityBound"
                                   :options="probabilityBoundOptions" placeholder="Select Type"/>
                    </div>
                    <div class="container-row-element  ml-1">
                      <label class="Type">Value:</label><br>
                      <UInput v-model="this.pspSpecification.probability" :min="0" :max="1" step="0.1" type="number"
                              placeholder="Enter Probability"/>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="item.key === 'time-bound'" class="selection-group">
                <div class="selection-group" :class="{ 'grayed-out': timeboundShouldGrayOut }">
                  <UCheckbox v-model="this.checkedTime" class="center" name="Time Bound"
                             label="Time Bound" :disabled="timeboundShouldGrayOut"/>
                </div>

                <div class="selection-group">
                  <div
                      v-show="this.checkedTime && this.pspSpecification.selectedOrder !== 'Precedence' && this.pspSpecification.selectedOrder !== 'PrecedenceChain1N' && this.pspSpecification.selectedOrder !== 'PrecedenceChainN1'">
                    <USelectMenu v-model="this.pspSpecification.selectedTimeBound" :options="timeBoundOptions"/>
                    <br><br>
                    <div v-if="this.pspSpecification.selectedTimeBound === 'Upper' ">
                      <UInput v-model="this.pspSpecification.upperLimit" :min="0" step="1" type="number"
                              placeholder="Within"/>
                      <UInput v-model="this.pspSpecification.timeUnit" type="text"/>
                    </div>
                    <div v-if="this.pspSpecification.selectedTimeBound === 'Lower' ">
                      <UInput v-model="this.pspSpecification.lowerLimit" :min="0" step="1" type="number"
                              placeholder="After"/>
                      <UInput v-model="this.pspSpecification.timeUnit" type="text"/>
                    </div>
                    <div v-if="this.pspSpecification.selectedTimeBound === 'Interval' ">
                      <div class="container-row">
                        <UInput v-model="this.pspSpecification.lowerLimit" :min="0" step="1" type="number"
                                placeholder="Enter lower Limit" class="container-row-element mr-1"/>
                        <UInput v-model="this.pspSpecification.upperLimit" :min="0" step="1" type="number"
                                placeholder="Enter upper Limit" class="container-row-element ml-1 mr-1"/>
                        <UInput v-model="this.pspSpecification.timeUnit" type="text"
                                class="container-row-element ml-1"/>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="selection-group">
                  <div
                      v-show="this.checkedTime && (this.pspSpecification.selectedOrder === 'Precedence' || this.pspSpecification.selectedOrder === 'PrecedenceChain1N' || this.pspSpecification.selectedOrder === 'PrecedenceChainN1')">
                    <USelectMenu v-model="this.pspSpecification.selectedTimeBound"/>
                    <div v-if="this.pspSpecification.selectedTimeBound === 'Interval' ">
                      <div class="container-row">
                        <UInput v-model="this.pspSpecification.lowerLimit" :min="0" step="1" type="number"
                                placeholder="Enter lower Limit" class="container-row-element mr-1"/>
                        <UInput v-model="this.pspSpecification.upperLimit" :min="0" step="1" type="number"
                                placeholder="Enter upper Limit" class="container-row-element ml-1 mr-1"/>
                        <UInput v-model="this.pspSpecification.timeUnit" type="text"
                                class="container-row-element ml-1"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </UCard>
          </template>
        </UTabs>
      </div>
    </div>
    <div class="selection-container">
      <div class="grouping-container">
        <UDivider label="Predicate Builder"></UDivider>
        <div v-if="this.type === 'response'">
          <UTabs :items="responseItems" class="w-full">
            <template #item="{ item }">
              <UCard>
                <p class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                  {{ item.label }}
                </p>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {{ item.description }}
                </p>

                <div v-if="item.key === 'addEvent'">
                  <br/>
                  <div class="container-row">
                    <div class="container-row-element-s right mr-2">
                      <label class="subtitle">Predicate Name: </label>
                    </div>
                    <div class="container-row-element">
                      <UInput v-model="customPredicateName" type="text"/>
                    </div>
                  </div>
                  <br>
                  <div class="container-row">
                    <div class="container-row-element-s right mr-2">
                      <label class="subtitle">Predicate Logic: </label>
                    </div>
                    <div class="container-row-element">
                      <USelectMenu v-model="customPredicateLogic" :options="displayPredicateLogics"
                                   option-attribute="label" value-attribute="value"/>
                    </div>
                  </div>
                  <br>
                  <div class="container-row">
                    <div class="container-row-element-s right mr-2">
                      <label class="subtitle">Measurement Source: </label>
                    </div>
                    <div class="container-row-element">
                      <USelectMenu searchable v-model="customMeasurementSource" :options="measurementSourceOptions"/>
                    </div>
                  </div>
                  <br>
                  <div class="container-row">
                    <div class="container-row-element-s right mr-2">
                      <label class="subtitle" :class="{ 'grayed-out': comparisonValueShouldGrayOut }">Comparison
                        Value: </label>
                    </div>
                    <div class="container-row-element">
                      <UInput v-model="customPredicateComparisonValue"
                              :class="{ 'grayed-out': comparisonValueShouldGrayOut }" type="text"/>
                    </div>
                  </div>
                  <br>
                  <UButton color="green" label="Save" @click="addCustomEvent"/>
                </div>

                <div v-if="item.key === 'editEvent'">
                  <br/>
                  <div class="container-row">
                    <div class="container-row-element-s right mr-2">
                      <label class="subtitle">Choose Event: </label>
                    </div>
                    <div class="container-row-element">
                      <USelectMenu searchable v-model="this.eventToChange" :options="state.events" value-attribute=""
                                   option-attribute="predicate_name"/>
                    </div>
                  </div>
                  <br>
                  <div v-if="this.eventToChange !== ''">
                    <div class="container-row">
                      <div class="container-row-element-s right mr-2">
                        <label class="subtitle">Predicate Name: </label>
                      </div>
                      <div class="container-row-element">
                        <UInput v-model="changedPredicateName" type="text"/>
                      </div>
                    </div>
                    <br>
                    <div class="container-row">
                      <div class="container-row-element-s right mr-2">
                        <label class="subtitle">Predicate Logic: </label>
                      </div>
                      <div class="container-row-element">
                        <USelectMenu v-model="changedPredicateLogic" :options="displayPredicateLogics"/>
                      </div>
                    </div>
                    <br>
                    <div class="container-row">
                      <div class="container-row-element-s right mr-2">
                        <label class="subtitle">Measurement Source: </label>
                      </div>
                      <div class="container-row-element">
                        <USelectMenu v-model="changedMeasurementSource" :options="measurementSourceOptions"/>
                      </div>
                    </div>
                    <br>
                    <div class="container-row">
                      <div class="container-row-element-s right mr-2">
                        <label class="subtitle" :class="{ 'grayed-out': comparisonValueShouldGrayOutEdit }">Comparison
                          Value: </label>
                      </div>
                      <div class="container-row-element">
                        <UInput v-model="changedPredicateComparisonValue" type="text"/>
                      </div>
                    </div>
                    <br>
                    <UButton class="m-1" color="green" @click="changeEvent">Save Changes</UButton>
                    <UButton class="m-1" color="red" @click="deleteEvent">Delete Event</UButton>
                  </div>
                </div>

                <div v-if="item.key === 'manageMeasurementSource'">
                  <br/>
                  <div class="container-row">
                    <div class="container-row-element mr-2">
                      <UInput v-model="newMeasurementSource" type="text"/>
                    </div>
                    <div class="container-row-element-xs left">
                      <UButton @click="addCustomMeasurementSource">Add</UButton>
                    </div>
                  </div>
                  <br/>
                  <div class="container-row">
                    <div class="container-row-element mr-2">
                      <USelectMenu searchable v-model="deleteMarkedMeasurementSource"
                                   :options="measurementSourceOptions"/>
                    </div>
                    <div class="container-row-element-xs left">
                      <UButton color="red" @click="deleteMeasurementSource"> Delete</UButton>
                    </div>
                  </div>
                </div>
              </UCard>
            </template>
          </UTabs>
        </div>


        <div v-if=" this.type==='stimulus'">

          <UTabs :items="stimulusItems" class="w-full">
            <template #item="{ item }">
              <UCard>
                <p class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                  {{ item.label }}
                </p>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {{ item.description }}
                </p>

                <div v-if="item.key === 'addCommand'">
                  <br/>
                  <div class="container-row">
                    <div class="container-row-element-s right mr-2">
                      <label class="subtitle">Command Name: </label>
                    </div>
                    <div class="container-row-element">
                      <UInput v-model="customCommandName" type="text"/>
                    </div>
                  </div>
                  <br/>
                  <div class="container-row">
                    <div class="container-row-element-s right mr-2">
                      <label class="subtitle">Command Content: </label>
                    </div>
                    <div class="container-row-element w-full">
                      <UButtonGroup class="w-full">
                        <UInput v-model="customCommandContent" type="text" class="w-full"/>
                        <UButton @click="commandAssistant.isOpen = true" color="white" label="Assistant"
                                 trailing-icon="i-heroicons-chevron-down-20-solid"/>
                      </UButtonGroup>
                    </div>
                  </div>
                  <br/>
                  <UButton color="green" @click="addCustomCommand">Save</UButton>
                </div>

                <div v-if="item.key === 'editCommand'">
                  <br/>
                  <div class="container-row">
                    <div class="container-row-element-s right mr-2">
                      <label class="subtitle">Choose Command: </label>
                    </div>
                    <div class="container-row-element">
                      <USelectMenu searchable v-model="this.commandToChange" :options="state.commands"
                                   option-attribute="command_name" value-attribute=""/>
                    </div>
                  </div>
                  <br>
                  <div v-if="this.commandToChange !== ''">
                    <div class="container-row">
                      <div class="container-row-element-s right mr-2">
                        <label class="subtitle">Command Name: </label>
                      </div>
                      <div class="container-row-element">
                        <UInput v-model="changedCommandName" type="text"></UInput>
                      </div>
                    </div>
                    <br>
                    <div class="container-row">
                      <div class="container-row-element-s right mr-2">
                        <label class="subtitle">Command Content: </label>
                      </div>
                      <div class="container-row-element">
                        <UInput v-model="changedCommandContent" type="text"></UInput>
                      </div>
                    </div>
                    <br>
                    <UButton class="mr-2" @click="changeCommand">Save</UButton>
                    <UButton color="red" @click="deleteCommand">Delete</UButton>
                  </div>
                </div>

                <div v-if="item.key === 'addListener'">
                  <br/>
                  <div class="container-row">
                    <div class="container-row-element-s right mr-2">
                      <label class="subtitle">Listener Name: </label>
                    </div>
                    <div class="container-row-element">
                      <UInput v-model="customListenerName" type="text"></UInput>
                    </div>
                  </div>
                  <br>
                  <div class="container-row">
                    <div class="container-row-element-s right mr-2">
                      <label class="subtitle">Listener Content: </label>
                    </div>
                    <div class="container-row-element w-full">
                      <UButtonGroup class="w-full">
                        <UInput v-model="customListenerContent" type="text" class="w-full"/>
                        <UButton @click="listenerAssistant.isOpen = true" color="white" label="Assistant"
                                 trailing-icon="i-heroicons-chevron-down-20-solid"/>
                      </UButtonGroup>
                    </div>
                  </div>
                  <br>
                  <UButton color="green" @click="addCustomListener">Save</UButton>
                </div>

                <div v-if="item.key === 'editListener'">
                  <br/>
                  <div class="container-row">
                    <div class="container-row-element-s right mr-2">
                      <label class="subtitle">Choose Listener: </label>
                    </div>
                    <div class="container-row-element">
                      <USelectMenu searchable v-model="this.listenerToChange" :options="state.listeners"
                                   option-attribute="listener_name" value-attribute=""></USelectMenu>
                    </div>
                  </div>
                  <br>
                  <div v-if="this.listenerToChange !== ''">
                    <div class="container-row">
                      <div class="container-row-element-s right mr-2">
                        <label class="subtitle">Listener Name: </label>
                      </div>
                      <div class="container-row-element">
                        <UInput v-model="changedListenerName" type="text"/>
                      </div>
                    </div>
                    <br>
                    <div class="container-row">
                      <div class="container-row-element-s right mr-2">
                        <label class="subtitle">Listener Content: </label>
                      </div>
                      <div class="container-row-element">
                        <UInput v-model="changedListenerContent" type="text"/>
                      </div>
                    </div>
                    <br>
                    <UButton class="mr-2" @click="changeListener">Save</UButton>
                    <UButton color="red" @click="deleteListener">Delete</UButton>
                  </div>
                </div>
              </UCard>
            </template>
          </UTabs>

        </div>
      </div>

    </div>
  </div>
  <div class="page-container">
    <div class="selection-container">
      <div class="message-container">
        <p>Build Specification:</p>
        <div v-if="this.pspSpecification.selectedScope === null">
          <span class="warning"> {{ "< No Scope Selected >" }} </span>
        </div>
        <div v-if="this.pspSpecification.selectedScope === 'Globally'">
          Globally
        </div>
        <div v-if="this.pspSpecification.selectedScope === 'BeforeR'">
          Before
          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedScopeEventR"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
        </div>
        <div v-if="this.pspSpecification.selectedScope === 'AfterQ'">
          After
          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedScopeEventQ"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
        </div>
        <div v-if="this.pspSpecification.selectedScope === 'BetweenQandR'">
          Between
          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedScopeEventQ"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
          and
          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedScopeEventR"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
        </div>
        <div v-if="this.pspSpecification.selectedScope === 'AfterQUntilR'">
          After
          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedScopeEventQ"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
          until
          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedScopeEventR"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
        </div>

        <br>

        <div v-if="this.pspSpecification.selectedOccurrence === null && this.pspSpecification.selectedOrder === null">
          <span class="warning"> {{ "< No Pattern Selected >" }} </span>
        </div>

        <div v-if="this.pspSpecification.selectedOccurrence === 'SteadyState'">
          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedEventP"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
          [holds] in the long run.
        </div>
        <div v-if="this.pspSpecification.selectedOccurrence === 'MinimumDuration'">
          once

          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedEventP"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
          [becomes satisfied] <br>
          it remains so for at least
          <div class="container-row center">
            <div class="min-width">
              <div class="container-row center">
                <div class="container-row-element">
                  <UInput v-model="this.pspSpecification.selectedTime" type="number"/>
                </div>
                <div class="container-row-element">
                  <UInput v-model="this.pspSpecification.selectedTimeUnitType" type="text"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="this.pspSpecification.selectedOccurrence === 'MaximumDuration'">
          once

          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedEventP"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
          [becomes satisfied] <br>
          it remains so for less than
          <div class="container-row center">
            <div class="min-width">
              <div class="container-row center">
                <div class="container-row-element">
                  <UInput v-model="this.pspSpecification.selectedTime" type="number"/>
                </div>
                <div class="container-row-element">
                  <UInput v-model="this.pspSpecification.selectedTimeUnitType" type="text"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="this.pspSpecification.selectedOccurrence === 'Recurrence'">

          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedEventP"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
          [holds] repeatedly <br>
          [every
          <div class="container-row center">
            <div class="min-width">
              <div class="container-row center">
                <div class="container-row-element">
                  <UInput v-model="this.pspSpecification.selectedTime" type="number"/>
                </div>
                <div class="container-row-element">
                  <UInput v-model="this.pspSpecification.selectedTimeUnitType" type="text"/>
                </div>
              </div>
            </div>
          </div>
          ]
        </div>
        <div v-if="this.pspSpecification.selectedOccurrence === 'Universality'">
          it is always the case that

          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedEventP"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
          holds.
        </div>
        <div v-if="this.pspSpecification.selectedOccurrence === 'Absence'">
          it is never the case that

          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedEventP"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
          holds.
        </div>
        <div v-if="this.pspSpecification.selectedOccurrence === 'Existence'">

          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedEventP"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
          [holds] eventually.
        </div>
        <div v-if="this.pspSpecification.selectedOccurrence === 'BoundedExistence'">

          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedEventP"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
          [holds] at most
          <div class="container-row center">
            <div class="min-width">
              <UInput v-model="this.pspSpecification.selectedInterval" type="number"/>
            </div>
          </div>
          times.
        </div>
        <div v-if="this.pspSpecification.selectedOccurrence === 'TransientState'">

          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedEventP"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
          [holds] after
          <div class="container-row center">
            <div class="min-width">
              <div class="container-row center">
                <div class="container-row-element">
                  <UInput v-model="this.pspSpecification.selectedTime" type="number"/>
                </div>
                <div class="container-row-element">
                  <UInput v-model="this.pspSpecification.selectedTimeUnitType" type="text"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="this.pspSpecification.selectedOrder=== 'Response'">
          if

          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedEventP"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
          [has occurred] <br>
          then in response

          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedEventS"
                           :options="predicates"></USelectMenu>
            </div>
          </div>

          [eventually holds]. <br>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Lower' ">
            after {{ this.pspSpecification.lowerLimit }} {{ this.pspSpecification.timeUnit }}
          </div>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Upper' ">
            within {{ this.pspSpecification.upperLimit }} {{ this.pspSpecification.timeUnit }}
          </div>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Interval' ">
            between {{ this.pspSpecification.lowerLimit }} and {{ this.pspSpecification.upperLimit }}
            {{ this.pspSpecification.timeUnit }}
          </div>

          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" placeholder="Constraint" searchable
                           v-model="this.pspSpecification.selectedConstraintEvent"
                           :options="constraintPredicates"></USelectMenu>
            </div>
          </div>

        </div>
        <div :key="componentKey" v-if="this.pspSpecification.selectedOrder=== 'ResponseChain1N'">
          if
          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedEventP"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
          [has occurred] <br>
          then in response
          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedEventS"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
          [eventually holds] <br>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Lower' ">
            after {{ this.pspSpecification.lowerLimit }} {{ this.pspSpecification.timeUnit }}
          </div>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Upper' ">
            within {{ this.pspSpecification.upperLimit }} {{ this.pspSpecification.timeUnit }}
          </div>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Interval' ">
            between {{ this.pspSpecification.lowerLimit }} and {{ this.pspSpecification.upperLimit }}
            {{ this.pspSpecification.timeUnit }}
          </div>
          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" placeholder="Constraint" searchable
                           v-model="this.pspSpecification.selectedConstraintEvent"
                           :options="constraintPredicates"></USelectMenu>
            </div>
          </div>
          <br>

          <div v-for="(chainedEvent, index) in this.pspSpecification.selectedChainedEvents" :key="index"
               class="chained-event-section">
            <label class="title">followed by </label>

            <div class="container-row center">
              <div class="min-width">
                <USelectMenu class="w-full" searchable v-model="chainedEvent.event.name"
                             :options="predicates"></USelectMenu>
              </div>
            </div>
            <br>
            <div>

              <div class="container-row center">
                <div class="min-width">
                  <USelectMenu class="w-full" v-model="chainedEvent.time_bound.type"
                               :options="extendedTimeBoundOptions" option-attribute="" value-attribute=""></USelectMenu>
                </div>
              </div>

              <div v-if="chainedEvent.time_bound.type === 'Upper' ">
                <div class="container-row center">
                  <div class="min-width">
                    <div class="container-row center">
                      <div class="container-row-element">
                        <UInput v-model="chainedEvent.time_bound.upper_limit" :min="0" step="1" type="number"
                                placeholder="Within"/>
                      </div>
                      <div class="container-row-element">
                        <UInput v-model="chainedEvent.time_bound.time_unit" type="text"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="chainedEvent.time_bound.type === 'Lower' ">
                <div class="container-row center">
                  <div class="min-width">
                    <div class="container-row center">
                      <div class="container-row-element">
                        <UInput v-model="chainedEvent.time_bound.lower_limit" :min="0" step="1" type="number"
                                placeholder="After"/>
                      </div>
                      <div class="container-row-element">
                        <UInput v-model="chainedEvent.time_bound.time_unit" type="text"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="chainedEvent.time_bound.type === 'Interval' ">
                <div class="container-row center">
                  <div class="min-width">
                    <div class="container-row center">
                      <div class="container-row-element">
                        <UInput v-model="chainedEvent.time_bound.lower_limit" :min="0" step="1" type="number"
                                placeholder="Enter lower Limit"/>
                      </div>
                      <div class="container-row-element">
                        <UInput v-model="chainedEvent.time_bound.upper_limit" :min="0" step="1" type="number"
                                placeholder="Enter upper Limit"/>
                      </div>
                      <div class="container-row-element">
                        <UInput v-model="chainedEvent.time_bound.time_unit" type="text"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="container-row center">
              <div class="min-width">
                <USelectMenu class="w-full" placeholder="Constraint" searchable
                             v-model="chainedEvent.constrain_event.name"
                             :options="constraintPredicates"></USelectMenu>
              </div>
            </div>
            <br>
            <UButton color="gray" @click="deleteChainedEvent(index)">Remove Chained Event</UButton>
          </div>

          <UButton color="gray" @click="addChainedEvent">Add Chained Event</UButton>
          <br>
          [eventually holds]
        </div>
        <div :key="componentKey" v-if="this.pspSpecification.selectedOrder=== 'ResponseChainN1'">
          if
          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedEventS"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
          <br>

          <div v-for="(chainedEvent, index) in this.pspSpecification.selectedChainedEvents" :key="index"
               class="chained-event-section">
            <label class="title">followed by </label>
            <div class="container-row center">
              <div class="min-width">
                <USelectMenu class="w-full" searchable v-model="chainedEvent.event.name"
                             :options="predicates"></USelectMenu>
              </div>
            </div>
            <br>
            <div>
              <div class="container-row center">
                <div class="min-width">
                  <USelectMenu class="w-full" v-model="chainedEvent.time_bound.type"
                               :options="extendedTimeBoundOptions" option-attribute="" value-attribute=""></USelectMenu>
                </div>
              </div>
              <div v-if="chainedEvent.time_bound.type === 'Upper' ">
                <div class="container-row center">
                  <div class="min-width">
                    <div class="container-row center">
                      <div class="container-row-element">
                        <UInput v-model="chainedEvent.time_bound.upper_limit" :min="0" step="1" type="number"
                                placeholder="Within"/>
                      </div>
                      <div class="container-row-element">
                        <UInput v-model="chainedEvent.time_bound.time_unit" type="text"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="chainedEvent.time_bound.type === 'Lower' ">
                <div class="container-row center">
                  <div class="min-width">
                    <div class="container-row center">
                      <div class="container-row-element">
                        <UInput v-model="chainedEvent.time_bound.lower_limit" :min="0" step="1" type="number"
                                placeholder="After"/>
                      </div>
                      <div class="container-row-element">
                        <UInput v-model="chainedEvent.time_bound.time_unit" type="text"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="chainedEvent.time_bound.type === 'Interval' ">
                <div class="container-row center">
                  <div class="min-width">
                    <div class="container-row center">
                      <div class="container-row-element">
                        <UInput v-model="chainedEvent.time_bound.lower_limit" :min="0" step="1" type="number"
                                placeholder="Enter lower Limit"/>
                      </div>
                      <div class="container-row-element">
                        <UInput v-model="chainedEvent.time_bound.upper_limit" :min="0" step="1" type="number"
                                placeholder="Enter upper Limit"/>
                      </div>
                      <div class="container-row-element">
                        <UInput v-model="chainedEvent.time_bound.time_unit" type="text"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="container-row center">
              <div class="min-width">
                <USelectMenu class="w-full" placeholder="Constraint" searchable
                             v-model="chainedEvent.constrain_event.name"
                             :options="constraintPredicates"></USelectMenu>
              </div>
            </div>
            <br>
            <button class="delete-chainedevent-button" @click="deleteChainedEvent(index)">Remove Chained Event
            </button>
          </div>
          <br>
          <button class="button" @click="addChainedEvent">Add Chained Event</button>
          <br>
          [have occured] <br>
          then in response

          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedEventP"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
          [eventually holds] <br>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Lower' ">
            after {{ this.pspSpecification.lowerLimit }} {{ this.pspSpecification.timeUnit }}
          </div>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Upper' ">
            within {{ this.pspSpecification.upperLimit }} {{ this.pspSpecification.timeUnit }}
          </div>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Interval' ">
            between {{ this.pspSpecification.lowerLimit }} and {{ this.pspSpecification.upperLimit }}
            {{ this.pspSpecification.timeUnit }}
          </div>
          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" placeholder="Constraint" searchable
                           v-model="this.pspSpecification.selectedConstraintEvent"
                           :options="constraintPredicates"></USelectMenu>
            </div>
          </div>
        </div>
        <div v-if="this.pspSpecification.selectedOrder=== 'ResponseInvariance'">
          if

          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedEventP"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
          [has occurred] <br>
          then in response
          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedEventS"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
          [holds] continually.
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Lower' ">
            after {{ this.pspSpecification.lowerLimit }} {{ this.pspSpecification.timeUnit }}
          </div>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Upper' ">
            within {{ this.pspSpecification.upperLimit }} {{ this.pspSpecification.timeUnit }}
          </div>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Interval' ">
            between {{ this.pspSpecification.lowerLimit }} and {{ this.pspSpecification.upperLimit }}
            {{ this.pspSpecification.timeUnit }}
          </div>
        </div>
        <div v-if="this.pspSpecification.selectedOrder=== 'Precedence'">
          if

          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedEventP"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
          [holds] then it must have been the case <br>
          that
          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedEventS"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
          [has occurred] <br>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Interval' ">
            between {{ this.pspSpecification.lowerLimit }} and {{ this.pspSpecification.upperLimit }}
            {{ this.pspSpecification.timeUnit }}
          </div>
          before

          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedEventP"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
          [holds].
        </div>
        <div :key="componentKey" v-if="this.pspSpecification.selectedOrder=== 'PrecedenceChain1N'">
          if
          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedEventS"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
          [has occurred] <br>

          <div v-for="(chainedEvent, index) in this.pspSpecification.selectedChainedEvents" :key="index"
               class="chained-event-section">
            <label class="title">and afterwards </label>
            <div class="container-row center">
              <div class="min-width">
                <USelectMenu class="w-full" searchable v-model="chainedEvent.event.name"
                             :options="predicates"></USelectMenu>
              </div>
            </div>
            <br>
            <div>
              <div>
                <div class="container-row center">
                  <div class="min-width">
                    <USelectMenu class="w-full" v-model="chainedEvent.time_bound.type"
                                 :options="upperTimeBoundOptions" option-attribute="" value-attribute=""></USelectMenu>
                  </div>
                </div>
                <div v-if="chainedEvent.time_bound.type === 'Upper' ">
                  <div class="container-row center">
                    <div class="min-width">
                      <div class="container-row center">
                        <div class="container-row-element">
                          <UInput v-model="chainedEvent.time_bound.upper_limit" :min="0" step="1" type="number"
                                  placeholder="Within"/>
                        </div>
                        <div class="container-row-element">
                          <UInput v-model="chainedEvent.time_bound.time_unit" type="text"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="container-row center">
              <div class="min-width">
                <USelectMenu class="w-full" placeholder="Constraint" searchable
                             v-model="chainedEvent.constrain_event.name"
                             :options="constraintPredicates"></USelectMenu>
              </div>
            </div>
            <br>
            <button class="delete-chainedevent-button" @click="deleteChainedEvent(index)">Remove Chained Event
            </button>
          </div>
          <br>

          <button class="button" @click="addChainedEvent">Add Chained Event</button>
          <br>

          [holds] <br>
          then it must be the case that

          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedEventP"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
          [has occured] <br>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Interval' ">
            between {{ this.pspSpecification.lowerLimit }} and {{ this.pspSpecification.upperLimit }}
            {{ this.pspSpecification.timeUnit }}
          </div>
          before
          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedEventS"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
          <br>
          [holds].
          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" placeholder="Constraint" searchable
                           v-model="this.pspSpecification.selectedConstraintEvent"
                           :options="constraintPredicates"></USelectMenu>
            </div>
          </div>
        </div>
        <div :key="componentKey" v-if="this.pspSpecification.selectedOrder=== 'PrecedenceChainN1'">
          if

          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedEventP"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
          [holds] <br>
          then it must be the case that
          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedEventS"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
          <br>

          <div v-for="(chainedEvent, index) in this.pspSpecification.selectedChainedEvents" :key="index"
               class="chained-event-section">
            <label class="title">and afterwards </label>
            <div class="container-row center">
              <div class="min-width">
                <USelectMenu class="w-full" searchable v-model="chainedEvent.event.name"
                             :options="predicates"></USelectMenu>
              </div>
            </div>
            <br>
            <div>
              <div>
                <div class="container-row center">
                  <div class="min-width">
                    <USelectMenu class="w-full" v-model="chainedEvent.time_bound.type"
                                 :options="extendedTimeBoundOptions" option-attribute=""
                                 value-attribute=""></USelectMenu>
                  </div>
                </div>
                <div v-if="chainedEvent.time_bound.type === 'Upper' ">
                  <div class="container-row center">
                    <div class="min-width">
                      <div class="container-row center">
                        <div class="container-row-element">
                          <UInput v-model="chainedEvent.time_bound.upper_limit" :min="0" step="1" type="number"
                                  placeholder="Within"/>
                        </div>
                        <div class="container-row-element">
                          <UInput v-model="chainedEvent.time_bound.time_unit" type="text"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="container-row center">
              <div class="min-width">
                <USelectMenu class="w-full" placeholder="Constraint" searchable
                             v-model="chainedEvent.constrain_event.name"
                             :options="constraintPredicates"></USelectMenu>
              </div>
            </div>
            <br>
            <button class="delete-chainedevent-button" @click="deleteChainedEvent(index)">Remove Chained Event
            </button>
          </div>
          <br>

          <button class="button" @click="addChainedEvent">Add Chained Event</button>
          <br>

          [have occurred] <br>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Interval' ">
            between {{ this.pspSpecification.lowerLimit }} and {{ this.pspSpecification.upperLimit }}
            {{ this.pspSpecification.timeUnit }}
          </div>
          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" placeholder="Constraint" searchable
                           v-model="this.pspSpecification.selectedConstraintEvent"
                           :options="constraintPredicates"></USelectMenu>
            </div>
          </div>
          <br>
          before

          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedEventP"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
          [holds] <br>
        </div>
        <div v-if="this.pspSpecification.selectedOrder=== 'Until'">

          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedEventP"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
          [holds] without interruption until <br>
          <div class="container-row center">
            <div class="min-width">
              <USelectMenu class="w-full" searchable v-model="this.pspSpecification.selectedEventS"
                           :options="predicates"></USelectMenu>
            </div>
          </div>
          [holds]
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Lower' ">
            after {{ this.pspSpecification.lowerLimit }} {{ this.pspSpecification.timeUnit }}
          </div>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Upper' ">
            within {{ this.pspSpecification.upperLimit }} {{ this.pspSpecification.timeUnit }}
          </div>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Interval' ">
            between {{ this.pspSpecification.lowerLimit }} and {{ this.pspSpecification.upperLimit }}
            {{ this.pspSpecification.timeUnit }}
          </div>
        </div>

        <br>
        <div v-if="this.pspSpecification.selectedPatternType=== 'Occurrence' ">
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Lower' ">
            after {{ this.pspSpecification.lowerLimit }} {{ this.pspSpecification.timeUnit }}
          </div>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Upper' ">
            within {{ this.pspSpecification.upperLimit }} {{ this.pspSpecification.timeUnit }}
          </div>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Interval' ">
            between {{ this.pspSpecification.lowerLimit }} and {{ this.pspSpecification.upperLimit }}
            {{ this.pspSpecification.timeUnit }}
          </div>
        </div>

        <br>

        <div
            v-if="this.pspSpecification.selectedProbabilityBound=== 'Lower' && this.pspSpecification.probability !== null">
          with a probability lower than {{ this.pspSpecification.probability }}
        </div>
        <div
            v-if="this.pspSpecification.selectedProbabilityBound=== 'LowerEqual' && this.pspSpecification.probability !== null">
          with a probability lower or equal than {{ this.pspSpecification.probability }}
        </div>
        <div
            v-if="this.pspSpecification.selectedProbabilityBound=== 'Greater' && this.pspSpecification.probability !== null">
          with a probability greater than {{ this.pspSpecification.probability }}
        </div>
        <div
            v-if="this.pspSpecification.selectedProbabilityBound=== 'GreaterEqual' && this.pspSpecification.probability !== null">
          with a probability greater or equal than {{ this.pspSpecification.probability }}
        </div>
      </div>

      <div class="selection-group">

      </div>

      <div class="message-container">
        <p>Preview:</p>
        <div v-if="!this.pspSpecification.mapping ||  !this.transformationPerformed">
          <br/>
          <span class="warning"> {{ "< Specification Incomplete >" }} </span>
        </div>
        <div v-if="this.pspSpecification.mapping && this.transformationPerformed">
          <div class="container-row center mb-2">
            <UToggle v-model="this.useNames" text="Use Predicate Names"></UToggle>
            <span class="ml-1">User-friendly Predicate Names</span>
          </div>
          <div class="container-row center">
            <div class="min-width">
              <div class="container-row center">
                <div class="container-row-element right mr-2">
                  Target Logic:
                </div>
                <div class="container-row-element">
                  <USelectMenu v-model="this.pspSpecification.selectedTargetLogic" value-attribute=""
                               option-attribute="" :options="targetLogicOptions"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br/>
        <div>
          <pre v-if="this.pspSpecification.mapping && this.transformationPerformed" style="white-space: normal;">{{
              this.pspSpecification.mapping
            }}</pre>
        </div>
        <br/>
        <span>
          <UButton @click="copyToClipboard" v-if="this.pspSpecification.mapping  && this.transformationPerformed"
                   class="copy-button">Copy to Clipboard
          </UButton>
        </span>
        <div class="copy-feedback" v-if="this.showCopyFeedback">{{ "Copied to Clipboard!" }}</div>
      </div>
    </div>
  </div>
  <div class="page-container">
    <div class="selection-container">
      <UButton @click="toScenarioEditor(this.simID)" color="red" size="xl"
               class="cancel-button">Cancel
      </UButton>
      <span :class="{ 'grayed-out': !this.pspSpecification.mapping }">
          <UButton @click="confirm" size="xl"
                   class="ml-2 { 'grayed-out': !this.pspSpecification.mapping }">Confirm</UButton>
        </span>
    </div>
  </div>
  <div class="selection-container text-gray-400">
    Scenario ID: {{ this.simID }}
  </div>

  <!-- Command Assistant Modal -->
  <UModal v-model="commandAssistant.isOpen">
    <UContainer class="mt-6 mb-6">

      <UFormGroup label="Command Type" class="mb-1 mt-1">
        <USelectMenu v-model="commandAssistant.type" :options="commandOptions"/>
      </UFormGroup>

      <div v-if="commandAssistant.type === 'kill'" class="mt-3">
        <UDivider label="Options"/>
        <UFormGroup label="Target Service Name" class="mb-1 mt-4" required>
          <USelectMenu searchable creatable v-model="commandAssistant.killOptions.targetServiceName"
                       :options="scenario.architectureData.serviceNames">
            <template #option-create="{ option }">
              <span class="flex-shrink-0">Use Custom Name</span>
            </template>
          </USelectMenu>
        </UFormGroup>
        <UCheckbox v-model="commandAssistant.killOptions.instanceCountActive" label="Kill Service Instances"
                   class="mb-1 mt-4"></UCheckbox>
        <UFormGroup label="Instance Count" class="mb-1 mt-1">
          <UInput v-model="commandAssistant.killOptions.instanceCount"
                  :disabled="!commandAssistant.killOptions.instanceCountActive" placeholder="Enter Instance Count"/>
        </UFormGroup>
        <UCheckbox v-model="commandAssistant.killOptions.eventNameActive" label="Throw Event"
                   class="mb-1 mt-4"></UCheckbox>
        <UFormGroup label="Event Name" class="mb-1 mt-1">
          <UInput v-model="commandAssistant.killOptions.eventName"
                  :disabled="!commandAssistant.killOptions.eventNameActive"
                  placeholder="Enter Event Name"/>
        </UFormGroup>
      </div>

      <div v-if="commandAssistant.type === 'load'">
        <UDivider label="Options"/>
        <UFormGroup label="Endpoint Name" class="mb-1 mt-1" required>
          <USelectMenu searchable creatable v-model="commandAssistant.loadOptions.targetEndpointName"
                       :options="scenario.architectureData.endpointNames">
            <template #option-create="{ option }">
              <span class="flex-shrink-0">Use Custom Name</span>
            </template>
          </USelectMenu>
        </UFormGroup>
        <UFormGroup label="Function Type" class="mb-1 mt-1" required>
          <USelectMenu v-model="commandAssistant.loadOptions.function" :options="loadFunctionOptions"
                       placeholder="Select Function Type"/>
        </UFormGroup>
        <UFormGroup label="Relative Load Increase Factor" class="mb-1 mt-1" required>
          <UInput v-model="commandAssistant.loadOptions.factor" placeholder="Enter Factor"/>
        </UFormGroup>
        <UFormGroup label="Start Time" class="mb-1 mt-1" required>
          <UInput v-model="commandAssistant.loadOptions.startTime" placeholder="Enter Start Time"/>
        </UFormGroup>
        <UFormGroup label="End Time" class="mb-1 mt-1" required>
          <UInput v-model="commandAssistant.loadOptions.endTime" placeholder="Enter End Time"/>
        </UFormGroup>
      </div>

      <div class="mt-2 container-row center">
        <UButton @click="applyCommandAssistant()" color="green" class="mr-1 ml-1">Apply</UButton>
        <UButton @click="cancelCommandAssistant()" color="red" class="mr-1 ml-1">Cancel</UButton>
      </div>
    </UContainer>
  </UModal>


  <!-- Listener Assistant Modal -->
  <UModal v-model="listenerAssistant.isOpen">
    <UContainer class="mt-6 mb-6">

      <UFormGroup label="Listener Type" class="mb-1 mt-1">
        <USelectMenu v-model="listenerAssistant.type" :options="listenerOptions"/>
      </UFormGroup>

      <div v-if="listenerAssistant.type === 'event'" class="mt-3">
        <UDivider label="Options"/>
        <UFormGroup label="Event Name" class="mb-1 mt-4">
          <UInput v-model="listenerAssistant.eventOptions.eventName"
                  placeholder="Enter Event Name"/>
        </UFormGroup>
      </div>

      <div class="mt-2 container-row center">
        <UButton @click="applyListenerAssistant()" color="green" class="mr-1 ml-1">Apply</UButton>
        <UButton @click="cancelListenerAssistant()" color="red" class="mr-1 ml-1">Cancel</UButton>
      </div>
    </UContainer>
  </UModal>

</template>

<style scoped>

.page-container {
  display: flex;
  margin: 0.5vw;
}

.selection-container {
  flex: 1;
}

.center {
  justify-content: center;
}

.selection-group {
  margin: 1vw;
}

.title {
  font-weight: bold;
}

.grouping-container {
  padding-top: 0.5vw;
  padding-bottom: 1.5vw;
  margin: 1vw;
}

.radio-group {
  display: flex;
  justify-content: center;
}

.radio-group input {
  margin-right: 5px;
}

.file-upload-container {
  position: relative;
  display: flex;
  align-items: center;
  margin: auto;
}

.file-upload {
  margin: auto;
  display: flex;
}

.file-upload-button {
  background-color: #aacbe9;
  color: #000000;
  padding: 0.5vh 0.7vh;
  border-radius: 0.5vh;
}

.file-upload-button:hover {
  background-color: #9bb8d3;
}

.custom-file-upload {
  cursor: pointer;
}

.info-icon {
  margin: auto;
  transform: translateX(1.2vh);
  cursor: pointer;
  color: #999;
}

.info-icon i {
  border: 0.1vh solid #999;
  border-radius: 50%;
  width: 2vh;
  height: 2vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5vh;
}

.download-schema {
  margin: auto;
  transform: translateX(2.5vh);
  cursor: pointer;
}

.import-error-text {
  font-size: 1.5vh;
  color: red;
}

.warning {
  color: red;
  font-weight: bolder;
}

.message-container {
  background-color: #f2f2f2;
  border: 1px solid #ddd;
  border-radius: 1vw;
  padding-top: 0.5vw;
  padding-bottom: 1.5vw;
  margin: auto;
  min-height: 6vw;
}

.message-container p {
  font-weight: bold;
}

.button {
  background-color: #ccc;
  border: none;
  color: black;
  padding: 0.4vw 1vw;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 0.6vw;
  margin: 0.2vw;
  cursor: pointer;
  border-radius: 4px;
  width: 8vw;
}

.chained-event-section {
  background-color: #dedede;
  border: 1px solid #c5c5c5;
  border-radius: 0.5vw;
  padding: 1vw;
  margin-bottom: 1vw;
}

.delete-chainedevent-button {
  background-color: rgba(164, 45, 45, 0.83);
  border: none;
  color: #e0e0e0;
  padding: 0.2vw 0.3vw;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 0.6vw;
  margin: 0.6vw;
  cursor: pointer;
  border-radius: 4px;
}

.delete-chainedevent-button:hover {
  background-color: rgba(130, 46, 46, 0.83);
}

.copy-button {
  background-color: #ccc;
  border: none;
  color: black;
  padding: 0.3vw 0.4vw;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  margin-top: 0.6vw;
  cursor: pointer;
  border-radius: 4px;
}

.copy-button:hover {
  background-color: #a1a1a1;
}

.copy-feedback {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #7a7a7a;
  color: #ffffff;
  padding: 8px;
  margin: 10px;
  border-radius: 4px;
  display: none;
  animation: fadeOut 2s forwards;
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    display: none;
  }
}

.grayed-out {
  pointer-events: none;
  opacity: 0.5;
}

.min-width {
  width: 15vw;
}

</style>