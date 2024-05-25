<script>
export default {
  data() {
    return {
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
      events: [/**{
       eventName: "Test(Test)",
       predicate: {
       predicate_name: "A",
       predicate_logic: "biggerEqual",
       predicate_comparison_value: "100",
       measurement_source: "resp_time_high"
       }
       } **/],
      simID: this.$route.query.simID,
      type: this.$route.query.type,
      popUp: null,
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
      probabilityBoundOptions: ["GreaterEqual", "Greater", "LowerEqual", "Lower"],
      showCopyFeedback: false,
      componentKey: 0,
      jsonData: null,
      importErrorMessage: null
    };
  },
  computed: {
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
    },
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
    },
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
    },
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
    },
    timeboundShouldGrayOut() {
      return !(this.pspSpecification.selectedPatternType === 'Order' ||
          this.pspSpecification.selectedOccurrence === 'Universality' ||
          this.pspSpecification.selectedOccurrence === 'Absence' ||
          this.pspSpecification.selectedOccurrence === 'Existence' ||
          this.pspSpecification.selectedOccurrence === 'BoundedExistence');
    },
    comparisonValueShouldGrayOut() {
      return !(this.customPredicateLogic === "bigger" ||
          this.customPredicateLogic === "biggerEqual" ||
          this.customPredicateLogic === "smaller" ||
          this.customPredicateLogic === "smallerEqual" ||
          this.customPredicateLogic === "equal");
    },
    comparisonValueShouldGrayOutEdit() {
      return !(this.changedPredicateLogic === "bigger" ||
          this.changedPredicateLogic === "biggerEqual" ||
          this.changedPredicateLogic === "smaller" ||
          this.changedPredicateLogic === "smallerEqual" ||
          this.changedPredicateLogic === "equal");
    },
  },
  setup() {
    const state = reactive({
      events: null,
      commands: null,
      listeners: null,
    });

    onMounted(async () => {
      const response = await fetch("/api/allEvents");
      state.events = await response.json();
    });
    onMounted(async () => {
      const response = await fetch("/api/allCommands");
      state.commands = await response.json();
    });
    onMounted(async () => {
      const response = await fetch("/api/allListeners");
      state.listeners = await response.json();
    });

    return {
      state,
    };
  },
  methods: {
    async initFields() {
      const res = await fetch("/api/getScenarios", {
        method: "POST",
        body: JSON.stringify({
          simulationID: this.simID
        })
      })
      const body = await res.json()
      if (typeof body.Scenario.specification.measurementSources !== "undefined") {
        this.measurementSourceOptions = body.Scenario.specification.measurementSources
      }
    },
    /**
     * Creates a scope object with the given parameters.
     *
     * @param {string} selectedScope - The selected scope type.
     * @param {string} selectedScopeEventQ - The selected Q event for the scope.
     * @param {string} selectedScopeEventR - The selected R event for the scope.
     * @param {Object[]} events - An array of available events.
     *
     * @return {Object} - The created scope object.
     */
    createScope(selectedScope, selectedScopeEventQ, selectedScopeEventR, events) {
      const scope = {
        type: selectedScope
      };

      // include q_event if it exists
      if (selectedScopeEventQ && selectedScopeEventQ.trim() !== "") {
        scope.q_event = this.createEvent(selectedScopeEventQ, events);
      }

      // include r_event if it exists
      if (selectedScopeEventR && selectedScopeEventR.trim() !== "") {
        scope.r_event = this.createEvent(selectedScopeEventR, events);
      }

      return scope;
    },

// creates the time_bound part of the payload
    createTimeBound(type, timeUnit, upperLimit, lowerLimit) {
      return {
        type: type,
        time_unit: timeUnit,
        upper_limit: upperLimit,
        lower_limit: lowerLimit
      };
    },

// creates probability part of the payload
    createProbabilityBound(type, probability) {
      return {
        type: type,
        probability: probability
      };
    },

// creates the pattern part of the payload
    createPattern(selectedPatternType, selectedOccurrence, selectedOrder, selectedEventP, selectedEventS, selectedChainedEvents, selectedTime, selectedTimeUnitType, selectedInterval, selectedConstraintEvent, selectedTimeBound, selectedProbabilityBound, timeUnit, probability, upperLimit, lowerLimit, events) {
      const pattern = {
        type: selectedPatternType === 'Occurrence' ? selectedOccurrence : selectedOrder,
        p_event: this.createEvent(selectedEventP, events)
      };

      // include s_event if exists
      if (selectedEventS && selectedEventS.trim() !== "") {
        pattern.s_event = this.createEvent(selectedEventS, events)
      }

      // include chained_events if one exists
      if (!selectedChainedEvents.isEmpty) {
        pattern.chained_events = selectedChainedEvents.map(chainedEvent => {

          let ch_event = {
            // event is required
            event: this.createEvent(chainedEvent.event.name, events),
            //constrain_event: createEvent(chainedEvent.constrain_event.name, events),
            //time_bound: time_bound(chainedEvent)
          };

          // constrain_event is optional
          if (chainedEvent.constrain_event && chainedEvent.constrain_event.name !== "Constraint") {
            ch_event.constrain_event = this.createEvent(chainedEvent.constrain_event.name, events)
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
          pattern.pattern_constrains.constrain_event = this.createEvent(selectedConstraintEvent, events)
        }
      }

      return pattern;
    },

// creates the payload
    createPayload(selectedScope, selectedScopeEventQ, selectedScopeEventR, selectionPatternType, selectedOccurrence, selectedOrder, selectedEventP, selectedEventS, selectedChainedEvents, selectedTime, selectedTimeUnitType, selectedInterval, selectedConstraintEvent, selectedTargetLogic, selectedTimeBound, selectedProbabilityBound, timeUnit, probability, upperLimit, lowerLimit, events) {
      return {
        scope: this.createScope(selectedScope, selectedScopeEventQ, selectedScopeEventR, events),
        pattern: this.createPattern(selectionPatternType, selectedOccurrence, selectedOrder, selectedEventP, selectedEventS, selectedChainedEvents, selectedTime, selectedTimeUnitType, selectedInterval, selectedConstraintEvent, selectedTimeBound, selectedProbabilityBound, timeUnit, probability, upperLimit, lowerLimit, events),
        target_logic: selectedTargetLogic
      };
    },
// creates the event part of the payload. Takes the predicate from the events-array based on the event name
    /**
     * Creates an event object with the given name from an array of events.
     *
     * @param {string} name - The name of the event to create.
     * @param {Array} events - An array of events.
     *
     * @return {Object} - An event object with the specified name and associated specification.
     *                   The event object has the following properties:
     *                   - name: The name of the event.
     *                   - specification: An object containing the specifications of the event,
     *                     including the predicate name, logic, comparison value, and measurement source.
     */
    createEvent(name, events) {
      if (this.type === "response") {
        const event = this.state.events.find(event => event.event_name === name);
        return {
          name: name,
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
          // send mock specification as it is not used anyway
          return {
            name: listener.listener_content,
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
            name: command.command_content,
            specification: {
              predicateName: command.command_name,
              predicateLogic: command.command_name,
              predicateComparisonValue: command.command_name,
              measurementSource: command.command_name
            }
          };
        }
      }
    },
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
    },
    async addValue(field, newValue) {
      const res = await fetch("/api/pushScenarioField", {
        method: "POST",
        body: JSON.stringify({
          simulationID: this.simID,
          fieldName: field,
          fieldValue: newValue
        })
      })
      const body = await res.json()
      console.log(body)
    },
    handleOccurrenceChange() {
      // Reset selected event when occurrence changes
      this.pspSpecification.selectedEvent = null;
    },
    handleTypeChange() {
      // Reset preview when pattern type changes
      this.pspSpecification.selectedOccurrence = null;
      this.pspSpecification.selectedOrder = null;
    },
    async addCustomMeasurementSource() {
      if (this.newMeasurementSource.trim() !== "" && !this.measurementSourceOptions.includes(this.newMeasurementSource.trim())) {
        this.measurementSourceOptions.push(this.newMeasurementSource.trim())
        await this.addValue("specification.measurementSources", this.newMeasurementSource)
        if (this.customMeasurementSource.trim() === "") { // set as current selected
          this.customMeasurementSource = this.newMeasurementSource
        }
        this.newMeasurementSource = "" // reset
      }
    },
    async addCustomEvent() {
      let trimmedName = this.customPredicateName.trim()
      // Add the custom event to the list if it is not empty
      if (trimmedName !== "") {
        if (this.eventNameExists(trimmedName)) {
          await this.failureMessage("Failure", "Name " + trimmedName + " already exists. Please choose another name.")
          return
        }
        /**
         this.events.push({
         eventName: this.customPredicateName + "(" + this.customMeasurementSource + ")",
         predicate: {
         predicate_name: this.customPredicateName,
         predicate_logic: this.customPredicateLogic,
         predicate_comparison_value: this.customPredicateComparisonValue,
         measurement_source: this.customMeasurementSource
         }
         });
         **/

            // write the event to the mongodb database
        const body = {
              event_name: this.customPredicateName + "(" + this.customMeasurementSource + ")",
              predicate_name: this.customPredicateName,
              predicate_logic: this.customPredicateLogic,
              predicate_comparison_value: this.customPredicateComparisonValue,
              measurement_source: this.customMeasurementSource,
            }
        const res = await fetch("/api/saveEvent", {
          method: "POST",
          body: JSON.stringify(body)
        })

        // also add this event to the local event array
        const response = await fetch("/api/allEvents");
        this.state.events = await response.json();

        // clear the input fields after adding the custom event
        this.customPredicateName = "";
        this.customPredicateLogic = "";
        this.customPredicateComparisonValue = "";
        this.customMeasurementSource = "";

        await this.successMessage("Added Event", "The event " + body.customPredicateName + " has been added successfully")
      }
    },
    async addCustomCommand() {
      let trimmedName = this.customCommandName.trim()
      // Add the custom command to the list if it is not empty
      if (trimmedName !== "") {
        if (this.commandNameExists(trimmedName) || this.listenerNameExists(trimmedName)) {
          await this.failureMessage("Failure", "Name " + trimmedName + " already exists. Please choose another name.")
          return
        }

        // write the event to the mongodb database
        const body = {
          command_name: this.customCommandName,
          command_content: this.customCommandContent,
        }
        const res = await fetch("/api/saveCommand", {
          method: "POST",
          body: JSON.stringify(body)
        })

        // also add this event to the local event array
        const response = await fetch("/api/allCommands");
        this.state.commands = await response.json();

        // clear the input fields after adding the custom event
        this.customCommandName = "";
        this.customCommandContent = "";

        await this.successMessage("Added Command", "The command " + body.command_name + " has been added successfully")
      }
    },
    listenerNameExists(name) {
      for (let listener of this.state.listeners) {
        if (listener.listener_name.trim() === name) {
          return true
        }
      }
      return false
    },
    commandNameExists(name) {
      for (let command of this.state.commands) {
        if (command.command_name.trim() === name) {
          return true
        }
      }
      return false
    },
    eventNameExists(name) {
      for (let event of this.state.events) {
        if (event.predicate_name.trim() === name) {
          return true
        }
      }
      return false
    },
    async addCustomListener() {
      // Add the custom event to the list if it is not empty
      let trimmedName = this.customListenerName.trim()
      if (trimmedName !== "") {
        if (this.commandNameExists(trimmedName) || this.listenerNameExists(trimmedName)) {
          await this.failureMessage("Failure", "Name " + trimmedName + " already exists. Please choose another name.")
          return
        }

        // write the event to the mongodb database
        const body = {
          listener_name: this.customListenerName,
          listener_content: this.customListenerContent,
        }
        const res = await fetch("/api/saveListener", {
          method: "POST",
          body: JSON.stringify(body)
        })

        // also add this event to the local event array
        const response = await fetch("/api/allListeners");
        this.state.listeners = await response.json();

        // clear the input fields after adding the custom event
        this.customListenerName = "";
        this.customListenerContent = "";

        await this.successMessage("Added Listener", "The listener " + body.listener_name + " has been added successfully")
      }
    },
    async successMessage(title, description) {
      this.popUp.add({
        icon: "i-heroicons-check-badge",
        title: title,
        color: "green",
        description: description
      })
    },
    async failureMessage(title, description) {
      this.popUp.add({
        icon: "i-heroicons-no-symbol",
        title: title,
        color: "red",
        description: description
      })
    },
    handleComparisonInputChange() {
      // remove non-numeric characters from the input
      this.customPredicateComparisonValue = this.customPredicateComparisonValue.replace(/\D/g, '');
      this.changedPredicateComparisonValue = this.changedPredicateComparisonValue.replace(/\D/g, '');

      this.handleInputChange();
    },
    eventToChangeSelected() {
      setTimeout(this.setEventChangeFields, 200)
    },
    async setEventChangeFields() {
      /*
      // get the event id from the mongodb database
      const body = {
        event_name: this.customPredicateName + "(" + this.customMeasurementSource + ")",
        predicate_name: this.customPredicateName,
        predicate_logic: this.customPredicateLogic,
        predicate_comparison_value: this.customPredicateComparisonValue,
        measurement_source: this.customMeasurementSource,
      }

      const response = await fetch("/api/getEventByProperties", {
        method: "POST",
        body: JSON.stringify(body)
      })

      console.log(response);

      this.changedEventId = await response.json();
       */

      this.changedEventId = this.eventToChange._id;

      this.changedPredicateName = this.eventToChange.predicate_name
      this.changedPredicateLogic = this.eventToChange.predicate_logic
      this.changedPredicateComparisonValue = this.eventToChange.predicate_comparison_value
      this.changedMeasurementSource = this.eventToChange.measurement_source

      this.forceRerender()
      this.handleInputChange()
    },
    commandToChangeSelected() {
      setTimeout(this.setCommandChangeFields, 200)
    },
    async setCommandChangeFields() {
      this.changedCommandId = this.commandToChange._id;

      this.changedCommandName = this.commandToChange.command_name
      this.changedCommandContent = this.commandToChange.command_content

      this.forceRerender()
      this.handleInputChange()
    },
    listenerToChangeSelected() {
      setTimeout(this.setListenerChangeFields, 200)
    },
    async setListenerChangeFields() {
      this.changedListenerId = this.listenerToChange._id;

      this.changedListenerName = this.listenerToChange.listener_name
      this.changedListenerContent = this.listenerToChange.listener_content

      this.forceRerender()
      this.handleInputChange()
    },
    async changeEvent() {
      let trimmedName = this.changedPredicateName.trim()
      if (this.eventNameExists(trimmedName)) {
        await this.failureMessage("Failure", "Name " + trimmedName + " already exists. Please choose another name.")
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
      const res = await fetch("/api/changeEvent", {
        method: "POST",
        body: JSON.stringify(body)
      })

      // also add this event to the local event array
      const response = await fetch("/api/allEvents");
      this.state.events = await response.json();

      // clear the input fields after adding the custom event
      this.changedPredicateName = "";
      this.changedPredicateLogic = "";
      this.changedPredicateComparisonValue = "";
      this.changedMeasurementSource = "";
      await this.successMessage("Changed Event", "The event " + body.customPredicateName + " has been changed successfully")
    },
    async changeCommand() {
      let trimmedName = this.changedCommandName.trim()
      if (this.commandNameExists(trimmedName) || this.listenerNameExists(trimmedName)) {
        await this.failureMessage("Failure", "Name " + trimmedName + " already exists. Please choose another name.")
        return
      }

      // write the command to the mongodb database
      const body = {
        _id: this.commandToChange._id,
        command_name: this.changedCommandName,
        command_content: this.changedCommandContent,
      }
      const res = await fetch("/api/changeCommand", {
        method: "POST",
        body: JSON.stringify(body)
      })

      // also add this command to the local command array
      const response = await fetch("/api/allCommands");
      this.state.commands = await response.json();

      // clear the input fields after adding the custom command
      this.changedCommandName = "";
      this.changedCommandContent = "";

      await this.successMessage("Changed Command", "The command " + body.command_name + " has been changed successfully")
    },
    async changeListener() {
      let trimmedName = this.changedListenerName.trim()
      if (this.commandNameExists(trimmedName) || this.listenerNameExists(trimmedName)) {
        await this.failureMessage("Failure", "Name " + trimmedName + " already exists. Please choose another name.")
        return
      }

      // write the listener to the mongodb database
      const body = {
        _id: this.listenerToChange._id,
        listener_name: this.changedListenerName,
        listener_content: this.changedListenerContent,
      }
      const res = await fetch("/api/changeListener", {
        method: "POST",
        body: JSON.stringify(body)
      })

      // also add this listener to the local listener array
      const response = await fetch("/api/allListeners");
      this.state.listeners = await response.json();

      // clear the input fields after adding the custom listener
      this.changedListenerName = "";
      this.changedListenerContent = "";

      await this.successMessage("Changed Listener", "The listener " + body.listener_name + " has been changed successfully")
    },
    async deleteEvent() {
      // delete the event from the mongodb database
      const body = {
        _id: this.eventToChange._id
      }

      // send a POST request to delete the event
      const deleteResponse = await fetch("/api/deleteEvent", {
        method: "POST",
        body: JSON.stringify(body)
      })

      // also add this event to the local event array
      const response = await fetch("/api/allEvents");
      this.state.events = await response.json();

      // clear the input fields after adding the custom event
      this.changedPredicateName = "";
      this.changedPredicateLogic = "";
      this.changedPredicateComparisonValue = "";
      this.changedMeasurementSource = "";
    },
    async deleteCommand() {
      // delete the command from the mongodb database
      const body = {
        _id: this.commandToChange._id
      }

      // send a POST request to delete the command
      const deleteResponse = await fetch("/api/deleteCommand", {
        method: "POST",
        body: JSON.stringify(body)
      })

      // also add this event to the local command array
      const response = await fetch("/api/allCommands");
      this.state.commands = await response.json();

      // clear the input fields after adding the custom command
      this.changedCommandName = "";
      this.changedCommandContent = "";
    },
    async deleteListener() {
      // delete the listener from the mongodb database
      const body = {
        _id: this.listenerToChange._id
      }

      // send a POST request to delete the event
      const deleteResponse = await fetch("/api/deleteListener", {
        method: "POST",
        body: JSON.stringify(body)
      })

      // also add this listener to the local listener array
      const response = await fetch("/api/allListeners");
      this.state.listeners = await response.json();

      // clear the input fields after adding the custom event
      this.changedListenerName = "";
      this.changedListenerContent = "";
    },
    async deleteMeasurementSource() {
      const deleteIndex = this.measurementSourceOptions.indexOf(this.deleteMarkedMeasurementSource)
      // delete mongodb database
      const body = {
        simulationID: this.simID,
        fieldName: "specification.measurementSources",
        fieldIndex: deleteIndex
      }

      // send a POST request to delete the event
      const deleteResponse = await fetch("/api/deleteScenarioField", {
        method: "POST",
        body: JSON.stringify(body)
      })

      // also delete from the local array
      this.measurementSourceOptions.splice(deleteIndex, 1)
    },
    addProbability() {
      // Add the custom probabilitity
      this.pspSpecification.probability.push()
    },
    handleProbabilityChange() {
      // Reset probabilityBound and probability when unchecked
      this.pspSpecification.selectedProbabilityBound = null;
      this.pspSpecification.probability = null;
    },
    handleTimeChange() {
      // Reset timeBound and timUnit when unchecked
      this.pspSpecification.selectedTimeBound = null;
      this.pspSpecification.timeUnit = "time units";
    },
    handleLimitChange() {
      // Reset limits when timeBound changes
      this.pspSpecification.upperLimit = null;
      this.pspSpecification.lowerLimit = null;
    },
    checkProbability() {
      //Checks if probability is between 0 and 1
      if (this.pspSpecification.probability < 0) {
        this.pspSpecification.probability = 0;
      } else if (this.pspSpecification.probability > 1) {
        this.pspSpecification.probability = 1;
      }
    },
    checkTime() {
      if (this.pspSpecification.upperLimit != null && this.pspSpecification.lowerLimit != null) {
        if (this.pspSpecification.upperLimit < this.pspSpecification.lowerLimit) {
          this.pspSpecification.lowerLimit = this.pspSpecification.upperLimit;
        }
      }
    },
    async sendTransformRequest(payload) {
      try {
        // Perform the HTTP request with the input data
        const response = await useFetch("/api/getPSPMapping", {
          method: "POST",
          body: payload
        })

        const responsePayload = await response.data.value.result

        // if mapping is returned, display it, else display the error message
        if (responsePayload.payload.mapping) {
          this.pspSpecification.mapping = responsePayload.payload.mapping
        } else {
          this.pspSpecification.mapping = responsePayload.payload.error
        }

        this.forceRerender()

        // Debug
        console.log(responsePayload)
        console.log(this.pspSpecification.mapping);
        console.log('Transformation successful!');

      } catch (error) {
        // Handle any errors that occur during the HTTP request
        console.error('Error transforming to temporal logic:', error);
      }
    },
    async transformToTemporalLogic() {

      const payload = this.createPayload(this.pspSpecification.selectedScope, this.pspSpecification.selectedScopeEventQ, this.pspSpecification.selectedScopeEventR, this.pspSpecification.selectedPatternType, this.pspSpecification.selectedOccurrence, this.pspSpecification.selectedOrder, this.pspSpecification.selectedEventP, this.pspSpecification.selectedEventS, this.pspSpecification.selectedChainedEvents, this.pspSpecification.selectedTime, this.pspSpecification.selectedTimeUnitType, this.pspSpecification.selectedInterval, this.pspSpecification.selectedConstraintEvent, this.pspSpecification.selectedTargetLogic, this.pspSpecification.selectedTimeBound, this.pspSpecification.selectedProbabilityBound, this.pspSpecification.timeUnit, this.pspSpecification.probability, this.pspSpecification.upperLimit, this.pspSpecification.lowerLimit, this.state.events);

      console.log(payload)
      console.log(this.pspSpecification.selectedChainedEvents)

      await this.sendTransformRequest(JSON.stringify(payload))

      this.forceRerender()
    },
    handleInputChange() {
      setTimeout(this.transformToTemporalLogic, 100)
    },
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
    },
    addChainedEvent() {
      this.pspSpecification.selectedChainedEvents.push({
        event: {
          //name: "",
          //specification: ""
        },
        constrain_event: {
          name: "Constraint"
          //specification: ""
        },
        time_bound: {
          //time_unit: "",
          type: "none",
          time_unit: "time units"
        }
      });
      this.forceRerender()
    },
    deleteChainedEvent(index) {
      if (index >= 0 && index < this.pspSpecification.selectedChainedEvents.length) {
        this.pspSpecification.selectedChainedEvents.splice(index, 1);
      } else {
        console.log("Error deleting the chained event");
      }
      this.handleInputChange()
    },
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

          console.log(jsonData);

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
            const res = await fetch("/api/saveEvent", {
              method: "POST",
              body: JSON.stringify(body)
            })
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
            const res = await fetch("/api/saveEvent", {
              method: "POST",
              body: JSON.stringify(body)
            })
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
            const res = await fetch("/api/saveEvent", {
              method: "POST",
              body: JSON.stringify(body)
            })
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
            const res = await fetch("/api/saveEvent", {
              method: "POST",
              body: JSON.stringify(body)
            })
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
              const res = await fetch("/api/saveEvent", {
                method: "POST",
                body: JSON.stringify(body)
              })
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
              const res = await fetch("/api/saveEvent", {
                method: "POST",
                body: JSON.stringify(body)
              })
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
                const res = await fetch("/api/saveEvent", {
                  method: "POST",
                  body: JSON.stringify(body)
                })
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
          const response = await fetch("/api/allEvents");
          this.state.events = await response.json();

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
    },
    // Save the mapping to the MongoDB Database and direct to the Scenario Editor
    async confirm() {
      let index;
      let responseObject = {
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

      // add all mappings to the commit
      for (index in this.targetLogicOptions) {
        var payload = this.createPayload(this.pspSpecification.selectedScope, this.pspSpecification.selectedScopeEventQ, this.pspSpecification.selectedScopeEventR, this.pspSpecification.selectedPatternType, this.pspSpecification.selectedOccurrence, this.pspSpecification.selectedOrder, this.pspSpecification.selectedEventP, this.pspSpecification.selectedEventS, this.pspSpecification.selectedChainedEvents, this.pspSpecification.selectedTime, this.pspSpecification.selectedTimeUnitType, this.pspSpecification.selectedInterval, this.pspSpecification.selectedConstraintEvent, this.targetLogicOptions[index], this.pspSpecification.selectedTimeBound, this.pspSpecification.selectedProbabilityBound, this.pspSpecification.timeUnit, this.pspSpecification.probability, this.pspSpecification.upperLimit, this.pspSpecification.lowerLimit, this.state.events);

        // Perform the HTTP request with the input data
        const response = await useFetch("/api/getPSPMapping", {
          method: "POST",
          body: payload
        })

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
      var pl = this.createPayload(this.pspSpecification.selectedScope, this.pspSpecification.selectedScopeEventQ, this.pspSpecification.selectedScopeEventR, this.pspSpecification.selectedPatternType, this.pspSpecification.selectedOccurrence, this.pspSpecification.selectedOrder, this.pspSpecification.selectedEventP, this.pspSpecification.selectedEventS, this.pspSpecification.selectedChainedEvents, this.pspSpecification.selectedTime, this.pspSpecification.selectedTimeUnitType, this.pspSpecification.selectedInterval, this.pspSpecification.selectedConstraintEvent, this.targetLogicOptions[0], this.pspSpecification.selectedTimeBound, this.pspSpecification.selectedProbabilityBound, this.pspSpecification.timeUnit, this.pspSpecification.probability, this.pspSpecification.upperLimit, this.pspSpecification.lowerLimit, this.state.events);
      const response = await useFetch("/api/getPSPMapping", {
        method: "POST",
        body: pl
      })
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

      var type
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

      const res = await fetch("/api/pushScenarioField", {
        method: "POST",
        body: JSON.stringify({
          simulationID: this.simID,
          fieldName: type,
          fieldValue: responseObject
        })
      })

      const body = await res.json()
      console.log("Success: " + body.success);
      console.log("Message: " + body.message);

      this.$router.push('/scenarioeditorSite?simID=' + this.simID);
    },
    async cancel() {
      this.$router.push('/scenarioeditorSite?simID=' + this.simID);
    },
    forceRerender() {
      this.componentKey += 1;
    }
  },
  beforeMount() {
    this.initFields()
    this.popUp = useToast()
  },
};
</script>

<template :key="componentKey">
  <div class="mb-4 mt-2">
    <h1 class="text-3xl"> PSPWizard </h1>
  </div>

  <div class="page-container">
    <div class="file-upload-container">
      <div class="file-upload">
        <div class="file-upload-button">
          <label for="fileInput" class="custom-file-upload">Import Specification</label>
          <input id="fileInput" type="file" ref="fileInput" @change="handleFileChange" style="display: none;">
        </div>
        <div class="info-icon">
          <i>i</i>
          <span class="info-text">Browse your local files to import a specification JSON matching the schema.</span>
        </div>
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
                <select v-model="this.pspSpecification.selectedScope" @input="handleInputChange(state.events)"
                        class="select-box">
                  <option v-for="scope in displayScopes" :key="scope.value" :value="scope.value" class="option">
                    {{ scope.label }}
                  </option>
                </select>
              </div>

              <div v-if="item.key === 'pattern'" class="selection-group">
                <div class="radio-group">
                  <div class="radio">
                    <input type="radio" v-model="this.pspSpecification.selectedPatternType" value="Occurrence"
                           id="occurrence"
                           @change="handleTypeChange" @input="handleInputChange"/>
                    <label for="occurrence">Occurrence</label>
                  </div>
                  <div class="radio">
                    <input type="radio" v-model="this.pspSpecification.selectedPatternType" value="Order" id="order"
                           @change="handleTypeChange" @input="handleInputChange"/>
                    <label for="order">Order</label>
                  </div>
                </div>
                <div
                    v-if="this.pspSpecification.selectedPatternType !== 'Occurrence' && this.pspSpecification.selectedPatternType !== 'Order'"
                    class="fake-selection-group">
                  <select v-model="this.pspSpecification.selectedOccurrence" @change="handleOccurrenceChange"
                          @input="handleInputChange" class="select-box">
                    <option v-for="occurrence in displayOccurrenceOptions" :key="occurrence.value"
                            :value="occurrence.value">
                      {{ occurrence.label }}
                    </option>
                  </select>
                </div>

                <div v-if="this.pspSpecification.selectedPatternType === 'Occurrence'" class="selection-group">
                  <label class="title">Pattern:</label><br>
                  <select v-model="this.pspSpecification.selectedOccurrence" @change="handleOccurrenceChange"
                          @input="handleInputChange" class="select-box">
                    <option v-for="occurrence in displayOccurrenceOptions" :key="occurrence.value"
                            :value="occurrence.value">
                      {{ occurrence.label }}
                    </option>
                  </select>
                </div>

                <div v-if="this.pspSpecification.selectedPatternType === 'Order'" class="selection-group">
                  <select v-model="this.pspSpecification.selectedOrder" @change="handleOccurrenceChange"
                          @input="handleInputChange" class="select-box">
                    <option v-for="order in displayOrderOptions" :key="order.value" :value="order.value">{{
                        order.label
                      }}
                    </option>
                  </select>
                </div>
              </div>

              <div v-if="item.key === 'probability-bound'" class="selection-group">
                <input type="checkbox" id="checkboxProb" v-model="this.checkedProbability"
                       @change="handleProbabilityChange"
                       @input="handleInputChange">
                <label class="title">Probability Bound</label>
              </div>

              <div class="selection-group">
                <div v-show="this.checkedProbability">
                  <select v-model="this.pspSpecification.selectedProbabilityBound" @input="handleInputChange"
                          class="select-box">
                    <option v-for="prob in probabilityBoundOptions" :key="prob">{{ prob }}</option>
                  </select> <br><br>
                  <input v-model="this.pspSpecification.probability" :min="0" :max="1" step="0.1" type="number"
                         placeholder="Enter Probability" @change="checkProbability" @input="handleInputChange">
                </div>
              </div>
              <div v-if="item.key === 'time-bound'" class="selection-group">
                <div class="selection-group" :class="{ 'grayed-out': timeboundShouldGrayOut }">
                  <input type="checkbox" id="checkboxTime" v-model="this.checkedTime" @change="handleTimeChange"
                         @input="handleInputChange">
                  <label class="title">Time Bound</label>
                </div>

                <div class="selection-group">
                  <div
                      v-show="this.checkedTime && this.pspSpecification.selectedOrder !== 'Precedence' && this.pspSpecification.selectedOrder !== 'PrecedenceChain1N' && this.pspSpecification.selectedOrder !== 'PrecedenceChainN1'">
                    <select v-model="this.pspSpecification.selectedTimeBound" @change="handleLimitChange"
                            @input="handleInputChange" class="select-box">
                      <option v-for="time in timeBoundOptions" :key="time">{{ time }}</option>
                    </select> <br><br>
                    <div v-if="this.pspSpecification.selectedTimeBound === 'Upper' ">
                      <input v-model="this.pspSpecification.upperLimit" :min="0" step="1" type="number"
                             placeholder="Within"
                             @input="handleInputChange">
                      <input v-model="this.pspSpecification.timeUnit" type="text" @input="handleInputChange">
                    </div>
                    <div v-if="this.pspSpecification.selectedTimeBound === 'Lower' ">
                      <input v-model="this.pspSpecification.lowerLimit" :min="0" step="1" type="number"
                             placeholder="After"
                             @input="handleInputChange">
                      <input v-model="this.pspSpecification.timeUnit" type="text" @input="handleInputChange">
                    </div>
                    <div v-if="this.pspSpecification.selectedTimeBound === 'Interval' ">
                      <input v-model="this.pspSpecification.lowerLimit" :min="0" step="1" type="number"
                             placeholder="Enter lower Limit" @change="checkTime" @input="handleInputChange">
                      <input v-model="this.pspSpecification.upperLimit" :min="0" step="1" type="number"
                             placeholder="Enter upper Limit" @change="checkTime" @input="handleInputChange">
                      <input v-model="this.pspSpecification.timeUnit" type="text">
                    </div>
                  </div>
                </div>
                <div class="selection-group">
                  <div
                      v-show="this.checkedTime && (this.pspSpecification.selectedOrder === 'Precedence' || this.pspSpecification.selectedOrder === 'PrecedenceChain1N' || this.pspSpecification.selectedOrder === 'PrecedenceChainN1')">
                    <select v-model="this.pspSpecification.selectedTimeBound" @change="handleLimitChange"
                            @input="handleInputChange" class="select-box">
                      <option v-for="time in this.pspSpecification.interval" :key="time">{{ time }}</option>
                    </select>
                    <div v-if="this.pspSpecification.selectedTimeBound === 'Interval' ">
                      <input v-model="this.pspSpecification.lowerLimit" :min="0" step="1" type="number"
                             placeholder="Enter lower Limit" @change="checkTime" @input="handleInputChange">
                      <input v-model="this.pspSpecification.upperLimit" :min="0" step="1" type="number"
                             placeholder="Enter upper Limit" @change="checkTime" @input="handleInputChange">
                      <input v-model="this.pspSpecification.timeUnit" type="text" @input="handleInputChange">
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
                  <label class="subtitle">Predicate Name: </label>
                  <input v-model="customPredicateName" type="text" @input="handleInputChange" class="select-event-box"/>
                  <br><br>
                  <label class="subtitle">Predicate Logic: </label>
                  <select v-model="customPredicateLogic" @input="handleInputChange" class="select-box">
                    <option v-for="logic in displayPredicateLogics" :key="logic.value" :value="logic.value">{{
                        logic.label
                      }}
                    </option>
                  </select> <br><br>
                  <label class="subtitle">Measurement Source: </label>
                  <select v-model="customMeasurementSource" @input="handleInputChange" class="select-box">
                    <option v-for="source in measurementSourceOptions" :key="source" :value="source">{{
                        source
                      }}
                    </option>
                  </select> <br><br>
                  <label class="subtitle" :class="{ 'grayed-out': comparisonValueShouldGrayOut }">Comparison
                    Value: </label>
                  <input v-model="customPredicateComparisonValue" type="text" @input="handleComparisonInputChange"
                         :class="{ 'grayed-out': comparisonValueShouldGrayOut }" class="select-event-box"/> <br><br>
                  <button class="add-event-button event-button" @click="addCustomEvent">Add Event</button>
                </div>

                <div v-if="item.key === 'editEvent'">
                  <br/>
                  <label class="subtitle">Choose Event: </label>
                  <select v-model="this.eventToChange" class="select-box" @input="eventToChangeSelected">
                    <option v-for="event of state.events" :key="event.event_name" :value="event">{{
                        event.predicate_name
                      }}
                    </option>
                  </select> <br><br>
                  <div v-if="this.eventToChange !== ''">
                    <label class="subtitle">Predicate Name: </label>
                    <input v-model="changedPredicateName" type="text" @input="handleInputChange"
                           class="select-event-box"/>
                    <br><br>
                    <label class="subtitle">Predicate Logic: </label>
                    <select v-model="changedPredicateLogic" @input="handleInputChange" class="select-box">
                      <option v-for="logic in displayPredicateLogics" :key="logic.value" :value="logic.value">{{
                          logic.label
                        }}
                      </option>
                    </select> <br><br>
                    <label class="subtitle">Measurement Source: </label>
                    <select v-model="changedMeasurementSource" @input="handleInputChange" class="select-box">
                      <option v-for="source in measurementSourceOptions" :key="source" :value="source">{{
                          source
                        }}
                      </option>
                    </select> <br><br>
                    <label class="subtitle" :class="{ 'grayed-out': comparisonValueShouldGrayOutEdit }">Comparison
                      Value: </label>
                    <input v-model="changedPredicateComparisonValue" type="text" @input="handleComparisonInputChange"
                           :class="{ 'grayed-out': comparisonValueShouldGrayOutEdit }" class="select-event-box"/>
                    <br><br>
                    <button class="add-event-button event-button" @click="changeEvent">Save Changes</button>
                    <button class="delete-event-button event-button" @click="deleteEvent">Delete this event</button>
                  </div>
                </div>

                <div v-if="item.key === 'manageMeasurementSource'">
                  <br/>
                  <input v-model="newMeasurementSource" type="text" class="select-event-box"/>
                  <button class="add-event-button event-button" @click="addCustomMeasurementSource">Add</button>
                  <br>
                  <select v-model="deleteMarkedMeasurementSource" class="select-box">
                    <option v-for="option in measurementSourceOptions">{{
                        option
                      }}
                    </option>
                  </select>
                  <button class="delete-event-button event-button" @click="deleteMeasurementSource">Delete</button>
                </div>
              </UCard>
            </template>
          </UTabs>
        </div>


        <div v-if="this.type === 'stimulus'">

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
                  <label class="subtitle">Command Name: </label>
                  <input v-model="customCommandName" type="text" @input="handleInputChange" class="select-event-box"/>
                  <br><br>
                  <label class="subtitle">Command Content: </label>
                  <input v-model="customCommandContent" type="text" @input="handleInputChange"
                         class="select-event-box"/>
                  <br>
                  <button class="add-event-button event-button" @click="addCustomCommand">Add</button>
                </div>

                <div v-if="item.key === 'editCommand'">
                  <br/>
                  <label class="subtitle">Choose Command: </label>
                  <select v-model="this.commandToChange" class="select-box" @input="commandToChangeSelected">
                    <option v-for="command of state.commands" :key="command.command_name" :value="command">{{
                        command.command_name
                      }}
                    </option>
                  </select> <br><br>
                  <div v-if="this.commandToChange !== ''">
                    <label class="subtitle">Command Name: </label>
                    <input v-model="changedCommandName" type="text" @input="handleInputChange"
                           class="select-event-box"/>
                    <br><br>
                    <label class="subtitle">Command Content: </label>
                    <input v-model="changedCommandContent" type="text" @input="handleInputChange"
                           class="select-event-box"/>
                    <br>
                    <button class="add-event-button event-button" @click="changeCommand">Save</button>
                    <button class="delete-event-button event-button" @click="deleteCommand">Delete</button>
                  </div>
                </div>

                <div v-if="item.key === 'addListener'">
                  <br/>
                  <label class="subtitle">Listener Name: </label>
                  <input v-model="customListenerName" type="text" @input="handleInputChange" class="select-event-box"/>
                  <br><br>
                  <label class="subtitle">Listener Content: </label>
                  <input v-model="customListenerContent" type="text" @input="handleInputChange"
                         class="select-event-box"/>
                  <br>
                  <button class="add-event-button event-button" @click="addCustomListener">Add</button>
                </div>

                <div v-if="item.key === 'editListener'">
                  <br/>
                  <label class="subtitle">Choose Listener: </label>
                  <select v-model="this.listenerToChange" class="select-box" @input="listenerToChangeSelected">
                    <option v-for="listener of state.listeners" :key="listener.event_name" :value="listener">{{
                        listener.listener_name
                      }}
                    </option>
                  </select> <br><br>
                  <div v-if="this.listenerToChange !== ''">
                    <label class="subtitle">Listener Name: </label>
                    <input v-model="changedListenerName" type="text" @input="handleInputChange"
                           class="select-event-box"/>
                    <br><br>
                    <label class="subtitle">Listener Content: </label>
                    <input v-model="changedListenerContent" type="text" @input="handleInputChange"
                           class="select-event-box"/>
                    <br>
                    <button class="add-event-button event-button" @click="changeListener">Save</button>
                    <button class="delete-event-button event-button" @click="deleteListener">Delete</button>
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
        <div v-if="this.pspSpecification.selectedScope === 'Globally'">
          Globally
        </div>
        <div v-if="this.pspSpecification.selectedScope === 'BeforeR'">
          Before
          <select v-model="this.pspSpecification.selectedScopeEventR" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
        </div>
        <div v-if="this.pspSpecification.selectedScope === 'AfterQ'">
          After
          <select v-model="this.pspSpecification.selectedScopeEventQ" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
        </div>
        <div v-if="this.pspSpecification.selectedScope === 'BetweenQandR'">
          Between
          <select v-model="this.pspSpecification.selectedScopeEventQ" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
          and
          <select v-model="this.pspSpecification.selectedScopeEventR" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
        </div>
        <div v-if="this.pspSpecification.selectedScope === 'AfterQUntilR'">
          After
          <select v-model="this.pspSpecification.selectedScopeEventQ" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
          until
          <select v-model="this.pspSpecification.selectedScopeEventR" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
        </div>

        <br>

        <div v-if="this.pspSpecification.selectedOccurrence === 'SteadyState'">
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
          [holds] in the long run.
        </div>
        <div v-if="this.pspSpecification.selectedOccurrence === 'MinimumDuration'">
          once
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
          [becomes satisfied] <br>
          it remains so for at least
          <input v-model="this.pspSpecification.selectedTime" type="number" @input="handleInputChange"
                 class="select-pattern-box"/>
          <input v-model="this.pspSpecification.selectedTimeUnitType" type="text" @input="handleInputChange"
                 class="select-pattern-box"/>
        </div>
        <div v-if="this.pspSpecification.selectedOccurrence === 'MaximumDuration'">
          once
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
          [becomes satisfied] <br>
          it remains so for less than
          <input v-model="this.pspSpecification.selectedTime" type="number" @input="handleInputChange"
                 class="select-pattern-box"/>
          <input v-model="this.pspSpecification.selectedTimeUnitType" type="text" @input="handleInputChange"
                 class="select-pattern-box"/>
        </div>
        <div v-if="this.pspSpecification.selectedOccurrence === 'Recurrence'">
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
          [holds] repeatedly <br>
          [every
          <input v-model="this.pspSpecification.selectedTime" type="number" @input="handleInputChange"
                 class="select-pattern-box"/>
          <input v-model="this.pspSpecification.selectedTimeUnitType" type="text" @input="handleInputChange"
                 class="select-pattern-box"/>
          ]
        </div>
        <div v-if="this.pspSpecification.selectedOccurrence === 'Universality'">
          it is always the case that
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
          holds.
        </div>
        <div v-if="this.pspSpecification.selectedOccurrence === 'Absence'">
          it is never the case that
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
          holds.
        </div>
        <div v-if="this.pspSpecification.selectedOccurrence === 'Existence'">
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
          [holds] eventually.
        </div>
        <div v-if="this.pspSpecification.selectedOccurrence === 'BoundedExistence'">
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
          [holds] at most
          <input v-model="this.pspSpecification.selectedInterval" type="number" @input="handleInputChange"
                 class="select-pattern-box"/>
          times.
        </div>
        <div v-if="this.pspSpecification.selectedOccurrence === 'TransientState'">
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
          [holds] after
          <input v-model="this.pspSpecification.selectedTime" type="number" @input="handleInputChange"
                 class="select-pattern-box"/>
          <input v-model="this.pspSpecification.selectedTimeUnitType" type="text" @input="handleInputChange"
                 class="select-pattern-box"/>
        </div>
        <div v-if="this.pspSpecification.selectedOrder=== 'Response'">
          if
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
          [has occurred] <br>
          then in response
          <select v-model="this.pspSpecification.selectedEventS" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
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
          <select v-model="this.pspSpecification.selectedConstraintEvent" @input="handleInputChange">
            <option value="Constraint">Constraint</option>
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
        </div>
        <div :key="componentKey" v-if="this.pspSpecification.selectedOrder=== 'ResponseChain1N'">
          if
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
          [has occurred] <br>
          then in response
          <select v-model="this.pspSpecification.selectedEventS" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
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
          <select v-model="this.pspSpecification.selectedConstraintEvent" @input="handleInputChange">
            <option value="Constraint">Constraint</option>
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select> <br>

          <div v-for="(chainedEvent, index) in this.pspSpecification.selectedChainedEvents" :key="index"
               class="chained-event-section">
            <label class="title">followed by </label>
            <select v-model="chainedEvent.event.name" @input="handleInputChange">
              <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                      :value="event.event_name">
                {{ event.predicate_name }}
              </option>
              <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                      :value="command.command_name">
                {{ command.command_name }}
              </option>
              <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                      :value="listener.listener_name">
                {{ listener.listener_name }}
              </option>
            </select> <br>
            <div>
              <select v-model="chainedEvent.time_bound.type" @change="handleLimitChange" @input="handleInputChange"
                      class="select-box">
                <option value="none">---</option>
                <option v-for="time in timeBoundOptions" :key="time">{{ time }}</option>
              </select>
              <div v-if="chainedEvent.time_bound.type === 'Upper' ">
                <input v-model="chainedEvent.time_bound.upper_limit" :min="0" step="1" type="number"
                       placeholder="Within" @input="handleInputChange">
                <input v-model="chainedEvent.time_bound.time_unit" type="text" @input="handleInputChange">
              </div>
              <div v-if="chainedEvent.time_bound.type === 'Lower' ">
                <input v-model="chainedEvent.time_bound.lower_limit" :min="0" step="1" type="number" placeholder="After"
                       @input="handleInputChange">
                <input v-model="chainedEvent.time_bound.time_unit" type="text" @input="handleInputChange">
              </div>
              <div v-if="chainedEvent.time_bound.type === 'Interval' ">
                <input v-model="chainedEvent.time_bound.lower_limit" :min="0" step="1" type="number"
                       placeholder="Enter lower Limit" @change="checkTime" @input="handleInputChange">
                <input v-model="chainedEvent.time_bound.upper_limit" :min="0" step="1" type="number"
                       placeholder="Enter upper Limit" @change="checkTime" @input="handleInputChange">
                <input v-model="chainedEvent.time_bound.time_unit" type="text" @input="handleInputChange">
              </div>
            </div>
            <select v-model="chainedEvent.constrain_event.name" @input="handleInputChange">
              <option value="Constraint">Constraint</option>
              <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                      :value="event.event_name">
                {{ event.predicate_name }}
              </option>
              <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                      :value="command.command_name">
                {{ command.command_name }}
              </option>
              <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                      :value="listener.listener_name">
                {{ listener.listener_name }}
              </option>
            </select> <br>
            <button class="delete-chainedevent-button" @click="deleteChainedEvent(index)">Remove Chained Event</button>
          </div>
          <br>

          <button class="button" @click="addChainedEvent">Add Chained Event</button>
          <br>
          [eventually holds]
        </div>
        <div :key="componentKey" v-if="this.pspSpecification.selectedOrder=== 'ResponseChainN1'">
          if
          <select v-model="this.pspSpecification.selectedEventS" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select> <br>

          <div v-for="(chainedEvent, index) in this.pspSpecification.selectedChainedEvents" :key="index"
               class="chained-event-section">
            <label class="title">followed by </label>
            <select v-model="chainedEvent.event.name" @input="handleInputChange">
              <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                      :value="event.event_name">
                {{ event.predicate_name }}
              </option>
              <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                      :value="command.command_name">
                {{ command.command_name }}
              </option>
              <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                      :value="listener.listener_name">
                {{ listener.listener_name }}
              </option>
            </select> <br>
            <div>
              <select v-model="chainedEvent.time_bound.type" @change="handleLimitChange" @input="handleInputChange"
                      class="select-box">
                <option value="none">---</option>
                <option v-for="time in timeBoundOptions" :key="time">{{ time }}</option>
              </select>
              <div v-if="chainedEvent.time_bound.type === 'Upper' ">
                <input v-model="chainedEvent.time_bound.upper_limit" :min="0" step="1" type="number"
                       placeholder="Within" @input="handleInputChange">
                <input v-model="chainedEvent.time_bound.time_unit" type="text" @input="handleInputChange">
              </div>
              <div v-if="chainedEvent.time_bound.type === 'Lower' ">
                <input v-model="chainedEvent.time_bound.lower_limit" :min="0" step="1" type="number" placeholder="After"
                       @input="handleInputChange">
                <input v-model="chainedEvent.time_bound.time_unit" type="text" @input="handleInputChange">
              </div>
              <div v-if="chainedEvent.time_bound.type === 'Interval' ">
                <input v-model="chainedEvent.time_bound.lower_limit" :min="0" step="1" type="number"
                       placeholder="Enter lower Limit" @change="checkTime" @input="handleInputChange">
                <input v-model="chainedEvent.time_bound.upper_limit" :min="0" step="1" type="number"
                       placeholder="Enter upper Limit" @change="checkTime" @input="handleInputChange">
                <input v-model="chainedEvent.time_bound.time_unit" type="text" @input="handleInputChange">
              </div>
            </div>
            <select v-model="chainedEvent.constrain_event.name" @input="handleInputChange">
              <option value="Constraint">Constraint</option>
              <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                      :value="event.event_name">
                {{ event.predicate_name }}
              </option>
              <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                      :value="command.command_name">
                {{ command.command_name }}
              </option>
              <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                      :value="listener.listener_name">
                {{ listener.listener_name }}
              </option>
            </select> <br>
            <button class="delete-chainedevent-button" @click="deleteChainedEvent(index)">Remove Chained Event</button>
          </div>
          <br>
          <button class="button" @click="addChainedEvent">Add Chained Event</button>
          <br>
          [have occured] <br>
          then in response
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
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
          <select v-model="this.pspSpecification.selectedConstraintEvent" @input="handleInputChange">
            <option value="Constraint">Constraint</option>
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
        </div>
        <div v-if="this.pspSpecification.selectedOrder=== 'ResponseInvariance'">
          if
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
          [has occurred] <br>
          then in response
          <select v-model="this.pspSpecification.selectedEventS" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
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
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
          [holds] then it must have been the case <br>
          that
          <select v-model="this.pspSpecification.selectedEventS" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
          [has occured] <br>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Interval' ">
            between {{ this.pspSpecification.lowerLimit }} and {{ this.pspSpecification.upperLimit }}
            {{ this.pspSpecification.timeUnit }}
          </div>
          before
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
          [holds].
        </div>
        <div :key="componentKey" v-if="this.pspSpecification.selectedOrder=== 'PrecedenceChain1N'">
          if
          <select v-model="this.pspSpecification.selectedEventS" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
          [has occurred] <br>

          <div v-for="(chainedEvent, index) in this.pspSpecification.selectedChainedEvents" :key="index"
               class="chained-event-section">
            <label class="title">and afterwards </label>
            <select v-model="chainedEvent.event.name" @input="handleInputChange">
              <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                      :value="event.event_name">
                {{ event.predicate_name }}
              </option>
              <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                      :value="command.command_name">
                {{ command.command_name }}
              </option>
              <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                      :value="listener.listener_name">
                {{ listener.listener_name }}
              </option>
            </select> <br>
            <div>
              <div>
                <select v-model="chainedEvent.time_bound.type" @change="handleLimitChange" @input="handleInputChange"
                        class="select-box">
                  <option value="none">---</option>
                  <option value="Upper">Upper</option>
                </select>
                <div v-if="chainedEvent.time_bound.type === 'Upper' ">
                  <input v-model="chainedEvent.time_bound.upper_limit" :min="0" step="1" type="number"
                         placeholder="Within" @input="handleInputChange">
                  <input v-model="chainedEvent.time_bound.time_unit" type="text" @input="handleInputChange">
                </div>
              </div>
            </div>
            <select v-model="chainedEvent.constrain_event.name" @input="handleInputChange">
              <option value="Constraint">Constraint</option>
              <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                      :value="event.event_name">
                {{ event.predicate_name }}
              </option>
              <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                      :value="command.command_name">
                {{ command.command_name }}
              </option>
              <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                      :value="listener.listener_name">
                {{ listener.listener_name }}
              </option>
            </select> <br>
            <button class="delete-chainedevent-button" @click="deleteChainedEvent(index)">Remove Chained Event</button>
          </div>
          <br>

          <button class="button" @click="addChainedEvent">Add Chained Event</button>
          <br>

          [holds] <br>
          then it must be the case that
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
          [has occured] <br>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Interval' ">
            between {{ this.pspSpecification.lowerLimit }} and {{ this.pspSpecification.upperLimit }}
            {{ this.pspSpecification.timeUnit }}
          </div>
          before
          <select v-model="this.pspSpecification.selectedEventS" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select> <br>
          [holds].
          <select v-model="this.pspSpecification.selectedConstraintEvent" @input="handleInputChange">
            <option value="Constraint">Constraint</option>
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
        </div>
        <div :key="componentKey" v-if="this.pspSpecification.selectedOrder=== 'PrecedenceChainN1'">
          if
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
          [holds] <br>
          then it must be the case that
          <select v-model="this.pspSpecification.selectedEventS" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select> <br>

          <div v-for="(chainedEvent, index) in this.pspSpecification.selectedChainedEvents" :key="index"
               class="chained-event-section">
            <label class="title">and afterwards </label>
            <select v-model="chainedEvent.event.name" @input="handleInputChange">
              <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                      :value="event.event_name">
                {{ event.predicate_name }}
              </option>
              <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                      :value="command.command_name">
                {{ command.command_name }}
              </option>
              <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                      :value="listener.listener_name">
                {{ listener.listener_name }}
              </option>
            </select> <br>
            <div>
              <div>
                <select v-model="chainedEvent.time_bound.type" @change="handleLimitChange" @input="handleInputChange"
                        class="select-box">
                  <option value="none">---</option>
                  <option value="Upper">Upper</option>
                </select>
                <div v-if="chainedEvent.time_bound.type === 'Upper' ">
                  <input v-model="chainedEvent.time_bound.upper_limit" :min="0" step="1" type="number"
                         placeholder="Within" @input="handleInputChange">
                  <input v-model="chainedEvent.time_bound.time_unit" type="text" @input="handleInputChange">
                </div>
              </div>
            </div>
            <select v-model="chainedEvent.constrain_event.name" @input="handleInputChange">
              <option value="Constraint">Constraint</option>
              <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                      :value="event.event_name">
                {{ event.predicate_name }}
              </option>
              <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                      :value="command.command_name">
                {{ command.command_name }}
              </option>
              <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                      :value="listener.listener_name">
                {{ listener.listener_name }}
              </option>
            </select> <br>
            <button class="delete-chainedevent-button" @click="deleteChainedEvent(index)">Remove Chained Event</button>
          </div>
          <br>

          <button class="button" @click="addChainedEvent">Add Chained Event</button>
          <br>

          [have occurred] <br>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Interval' ">
            between {{ this.pspSpecification.lowerLimit }} and {{ this.pspSpecification.upperLimit }}
            {{ this.pspSpecification.timeUnit }}
          </div>
          <select v-model="this.pspSpecification.selectedConstraintEvent" @input="handleInputChange">
            <option value="Constraint">Constraint</option>
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select> <br>
          before
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
          [holds] <br>
        </div>
        <div v-if="this.pspSpecification.selectedOrder=== 'Until'">
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
          [holds] without interruption until <br>
          <select v-model="this.pspSpecification.selectedEventS" @input="handleInputChange">
            <option v-if="this.type === 'response'" v-for="event of state.events" :key="event.event_name"
                    :value="event.event_name">
              {{ event.predicate_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="command of state.commands" :key="command.command_name"
                    :value="command.command_name">
              {{ command.command_name }}
            </option>
            <option v-if="this.type === 'stimulus'" v-for="listener of state.listeners" :key="listener.listener_name"
                    :value="listener.listener_name">
              {{ listener.listener_name }}
            </option>
          </select>
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
        <div v-if="this.pspSpecification.mapping">
          Target Logic:
          <select v-model="this.pspSpecification.selectedTargetLogic" @input="handleInputChange">
            <option v-for="targetLogic in targetLogicOptions" :key="targetLogic">{{ targetLogic }}</option>
          </select>
        </div>
        <br/>
        <div>
          <pre v-if="this.pspSpecification.mapping" style="white-space: normal;">{{
              this.pspSpecification.mapping
            }}</pre>
        </div>
        <br/>
        <span>
          <UButton @click="copyToClipboard" v-if="this.pspSpecification.mapping" class="copy-button">Copy to Clipboard
          </UButton>
        </span>
        <div class="copy-feedback" v-if="this.showCopyFeedback">{{ "Copied to Clipboard!" }}</div>
      </div>
    </div>
  </div>
  <div class="page-container">
    <div class="selection-container">
      <UButton @click="cancel" color="red" size="xl"
               class="cancel-button">Cancel
      </UButton>
      <span :class="{ 'grayed-out': !this.pspSpecification.mapping }">
          <UButton @click="confirm" size="xl"
                   class="commit-button { 'grayed-out': !this.pspSpecification.mapping }">Confirm</UButton>
        </span>
    </div>
  </div>
  <div class="selection-container">
    Scenario ID: {{ this.simID }}
  </div>
</template>

<style scoped>

.page-container {
  display: flex;
  margin: 0.5vw;
}

.selection-container {
  flex: 1;
}

.selection-group {
  margin: 1vw;
}

.fake-selection-group {
  margin: 1vw;
  pointer-events: none;
  opacity: 0.5;
}

.title {
  font-weight: bold;
}

.grouping-container {
  padding-top: 0.5vw;
  padding-bottom: 1.5vw;
  margin: 1vw;
}

.select-box {
  width: 15vw;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
}

.select-pattern-box {
  width: 30%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.select-event-box {
  width: 30%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-left: 0.4vw;
}

.radio-group {
  display: flex;
  justify-content: center;
}

.radio-group input {
  margin-right: 5px;
}

.radio {
  margin-right: 1vw;
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

.info-text {
  display: none;
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  padding: 8px;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 4px;
  z-index: 1;
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

.info-icon:hover .info-text {
  display: block;
}

.message-container {
  background-color: #f2f2f2;
  border: 1px solid #ddd;
  border-radius: 1vw;
  padding-top: 0.5vw;
  padding-bottom: 1.5vw;
  margin: auto;
  min-height: 6vw;
  max-height: 40vh;
  overflow-y: auto;
}

.message-container p {
  font-weight: bold;
}

.expand-icon {
  cursor: pointer;
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

.event-button {
  background-color: #ccc;
  border: none;
  color: black;
  padding: 0.5vw 0.5vw;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 0.6vw;
  margin: 1vw;
  cursor: pointer;
  border-radius: 4px;
  width: 8vw;
}

.event-button:hover {
  background-color: #b9b9b9;
}

.add-event-button {
  background-color: #4CAF50;
  color: white;
}

.add-event-button:hover {
  background-color: #3d8d41;
}

.delete-event-button {
  background-color: #da2222;
  color: white;
}

.delete-event-button:hover {
  background-color: #a11414;
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

.cancel-button, .commit-button {
  margin-left: 0.6vw;
}

.commit-button:hover {
  background-color: #3d8d41;
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

</style>