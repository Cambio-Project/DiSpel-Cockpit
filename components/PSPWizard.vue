<script>
//import axios from "core-js/internals/queue";

// creates the scope part of the payload
import * as events from "events";

function createScope(selectedScope, selectedScopeEventQ, selectedScopeEventR, events) {
  const scope = {
    type: selectedScope
  };

  // include q_event if it exists
  if (selectedScopeEventQ && selectedScopeEventQ.trim() !== "") {
    scope.q_event = createEvent(selectedScopeEventQ, events);
  }

  // include r_event if it exists
  if (selectedScopeEventR && selectedScopeEventR.trim() !== "") {
    scope.r_event = createEvent(selectedScopeEventR, events);
  }

  return scope;
}

// creates the event part of the payload. Takes the predicate from the events-array based on the event name
function createEvent(name, events) {
  const event = events.find(event => event.event_name === name);
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

// creates the time_bound part of the payload
function createTimeBound(type, timeUnit, upperLimit, lowerLimit) {
  return {
    type: type,
    time_unit: timeUnit,
    upper_limit: upperLimit,
    lower_limit: lowerLimit
  };
}

// creates probability part of the payload
function createProbabiltiyBound(type, probability){
  return {
    type: type,
    probability: probability
  };
}

// creates the pattern part of the payload
function createPattern(selectedPatternType, selectedOccurrence, selectedOrder, selectedEventP, selectedEventS, selectedChainedEvents, selectedTime, selectedTimeUnitType, selectedInterval, selectedConstraintEvent, selectedTimeBound, selectedProbabilityBound, timeUnit, probability, upperLimit, lowerLimit, events) {
  const pattern = {
    type: selectedPatternType === 'Occurrence' ? selectedOccurrence : selectedOrder,
    p_event: createEvent(selectedEventP, events)
  };

  // include s_event if exists
  if (selectedEventS && selectedEventS.trim() !== "") {
    pattern.s_event = createEvent(selectedEventS, events)
  }

  // include chained_events if one exists
  if (!selectedChainedEvents.isEmpty) {
    pattern.chained_events = selectedChainedEvents.map(chainedEvent => {

      let ch_event = {
        // event is required
        event: createEvent(chainedEvent.event.name, events),
        //constrain_event: createEvent(chainedEvent.constrain_event.name, events),
        //time_bound: time_bound(chainedEvent)
      };

      // constrain_event is optional
      if (chainedEvent.constrain_event && chainedEvent.constrain_event.name !== "Constraint") {
        ch_event.constrain_event = createEvent(chainedEvent.constrain_event.name, events)
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
  if (selectedProbabilityBound || selectedTimeBound || (selectedConstraintEvent && selectedConstraintEvent !== "Constraint") ) {
    pattern.pattern_constrains = {}

    if (selectedProbabilityBound !== null && probability !== null) {
      if (selectedTimeBound !== null && upperLimit !== null && lowerLimit !==null) {
        pattern.pattern_constrains = {
          time_bound: createTimeBound(selectedTimeBound, timeUnit, upperLimit, lowerLimit),
          probability_bound: createProbabiltiyBound(selectedProbabilityBound, probability),
        };
      }
      else if (selectedTimeBound !== null && upperLimit === null && lowerLimit !== null) {
        pattern.pattern_constrains = {
          time_bound: createTimeBound(selectedTimeBound, timeUnit, 0, lowerLimit),
          probability_bound: createProbabiltiyBound(selectedProbabilityBound, probability),
        };
      }
      else if (selectedTimeBound !== null && upperLimit !== null && lowerLimit === null) {
        pattern.pattern_constrains = {
          time_bound: createTimeBound(selectedTimeBound, timeUnit, upperLimit, 0),
          probability_bound: createProbabiltiyBound(selectedProbabilityBound, probability),
        };
      }
      else {
        pattern.pattern_constrains = {
          probability_bound: createProbabiltiyBound(selectedProbabilityBound, probability),
        };
      }
    }
    else if (selectedProbabilityBound === null || probability === null) {
      if (selectedTimeBound !== null && upperLimit !== null && lowerLimit !==null) {
        pattern.pattern_constrains = {
          time_bound: createTimeBound(selectedTimeBound, timeUnit, upperLimit, lowerLimit),
        };
      }
      else if (selectedTimeBound !== null && upperLimit === null && lowerLimit !== null) {
        pattern.pattern_constrains = {
          time_bound: createTimeBound(selectedTimeBound, timeUnit, 0, lowerLimit),
        };
      }
      else if (selectedTimeBound !== null && upperLimit !== null && lowerLimit === null) {
        pattern.pattern_constrains = {
          time_bound: createTimeBound(selectedTimeBound, timeUnit, upperLimit, 0),
        };
      }
    }

    if (selectedConstraintEvent && selectedConstraintEvent !== "Constraint") {
      pattern.pattern_constrains.constrain_event = createEvent(selectedConstraintEvent, events)
    }
  }

  return pattern;
}

// creates the payload
function createPayload(selectedScope, selectedScopeEventQ, selectedScopeEventR, selectionPatternType, selectedOccurrence, selectedOrder, selectedEventP, selectedEventS, selectedChainedEvents, selectedTime, selectedTimeUnitType, selectedInterval, selectedConstraintEvent, selectedTargetLogic, selectedTimeBound, selectedProbabilityBound, timeUnit, probability, upperLimit, lowerLimit, events) {
  return {
    scope: createScope(selectedScope, selectedScopeEventQ, selectedScopeEventR, events),
    pattern: createPattern(selectionPatternType, selectedOccurrence, selectedOrder, selectedEventP, selectedEventS, selectedChainedEvents, selectedTime, selectedTimeUnitType, selectedInterval, selectedConstraintEvent, selectedTimeBound, selectedProbabilityBound, timeUnit, probability, upperLimit, lowerLimit, events),
    target_logic: selectedTargetLogic
  };
}

export default {
  data() {
    return {
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
      customPredicateName: "",
      customPredicateLogic: "",
      customMeasurementSource: "",
      customPredicateComparisonValue: "",
      eventToChange: "",
      changedPredicateName: "",
      changedPredicateLogic: "",
      changedMeasurementSource: "",
      changedPredicateComparisonValue: "",
      changedEventId: "",
      predicateLogicOptions: ['equal', 'smallerEqual', 'smaller', 'biggerEqual', 'bigger', 'trendUpward', 'trendUpwardStrict', 'trendDownward', 'trendDownwardStrict',],
      measurementSourceOptions: ["example-service_1_I0_CPU_Utilization", "example-service_1_I1_CPU_Utilization", "example-service_1_I2_Requests_InSystem"],
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
      return this.predicateLogicOptions.map(logic => ({ label: logicMap[logic], value: logic }));
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
      return this.scopeOptions.map(scope => ({ label: scopeMap[scope], value: scope }));
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
      return this.occurrenceOptions.map(option => ({ label: occurenceMap[option], value: option }));
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
      return this.orderOptions.map(option => ({ label: orderMap[option], value: option }));
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
  },
  setup() {
    const state = reactive({
      events: null,
    });

    onMounted(async () => {
      const response = await fetch("/api/allEvents");
      state.events = await response.json();
    });

    return {
      state,
    };
  },
  methods: {
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
    handleOccurrenceChange() {
      // Reset selected event when occurrence changes
      this.pspSpecification.selectedEvent = null;
    },
    handleTypeChange() {
      // Reset preview when pattern type changes
      this.pspSpecification.selectedOccurrence = null;
      this.pspSpecification.selectedOrder = null;
    },
    async addCustomEvent() {
      // Add the custom event to the list if it is not empty
      if (this.customPredicateName.trim() !== "") {
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
      }
    },
    eventToChangeSelected() {
      setTimeout(this.setEventChangeFields,200)
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
    async changeEvent() {
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
    checkProbability(){
      //Checks if probability is between 0 and 1
      if(this.pspSpecification.probability<0)
      {
        this.pspSpecification.probability = 0;
      }
      else if(this.pspSpecification.probability >1)
      {
        this.pspSpecification.probability = 1;
      }
    },
    checkTime(){
      if(this.pspSpecification.upperLimit != null && this.pspSpecification.lowerLimit != null)
      {
        if(this.pspSpecification.upperLimit < this.pspSpecification.lowerLimit)
        {
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

      const payload = createPayload(this.pspSpecification.selectedScope, this.pspSpecification.selectedScopeEventQ, this.pspSpecification.selectedScopeEventR, this.pspSpecification.selectedPatternType, this.pspSpecification.selectedOccurrence, this.pspSpecification.selectedOrder, this.pspSpecification.selectedEventP, this.pspSpecification.selectedEventS, this.pspSpecification.selectedChainedEvents, this.pspSpecification.selectedTime, this.pspSpecification.selectedTimeUnitType, this.pspSpecification.selectedInterval, this.pspSpecification.selectedConstraintEvent, this.pspSpecification.selectedTargetLogic, this.pspSpecification.selectedTimeBound, this.pspSpecification.selectedProbabilityBound, this.pspSpecification.timeUnit, this.pspSpecification.probability, this.pspSpecification.upperLimit, this.pspSpecification.lowerLimit, this.state.events);

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
    // Save the mapping to the Vue store and direct to the Scenario Editor
    async confirm() {
      var index;

      // add all mappings to the commit
      for (index in this.targetLogicOptions) {
        var payload = createPayload(this.pspSpecification.selectedScope, this.pspSpecification.selectedScopeEventQ, this.pspSpecification.selectedScopeEventR, this.pspSpecification.selectedPatternType, this.pspSpecification.selectedOccurrence, this.pspSpecification.selectedOrder, this.pspSpecification.selectedEventP, this.pspSpecification.selectedEventS, this.pspSpecification.selectedChainedEvents, this.pspSpecification.selectedTime, this.pspSpecification.selectedTimeUnitType, this.pspSpecification.selectedInterval, this.pspSpecification.selectedConstraintEvent, this.targetLogicOptions[index], this.pspSpecification.selectedTimeBound, this.pspSpecification.selectedProbabilityBound, this.pspSpecification.timeUnit, this.pspSpecification.probability, this.pspSpecification.upperLimit, this.pspSpecification.lowerLimit, this.state.events);

        // Perform the HTTP request with the input data
        const response = await useFetch("/api/getPSPMapping", {
          method: "POST",
          body: payload
        })

        const responsePayload = await response.data.value.result

        // if mapping is returned, display it, else display the error message
        if (responsePayload.payload.mapping) {
          this.formulas.push(responsePayload.payload.mapping);
        } else {
          this.formulas.push("")
        }
      }

      // add target logic index to commit
      var number = this.targetLogicOptions.indexOf(this.pspSpecification.selectedTargetLogic)
      this.formulas.push(number)

      // add predicates to commit
      let eventArray = [];
      this.state.events.forEach(event => {
        eventArray.push({
          predicate_name: event.predicate_name,
          predicate_logic: event.predicate_logic,
          measurement_source: event.measurement_source,
          predicate_comparison_value: event.predicate_comparison_value
        });
      });
      this.formulas.push(eventArray)

      if (this.$store.state.outputType === 'Stimulus') {
        this.$store.commit('addStimulus', this.formulas)
      }

      if (this.$store.state.outputType === 'Response') {
        this.$store.commit('addResponse', this.formulas)
      }

      this.$router.push('/scenarioeditorSite');
    },
    forceRerender() {
      this.componentKey += 1;
    }
  },
};

</script>

<template :key="componentKey">
  <h1>PSPWizard as {{ this.$store.state.outputType  }}</h1>
  <div class="page-container">
    <div class="selection-container">
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

      <div class="grouping-container">
        <div class="selection-group">
          <label class="title">Scope:</label><br>
          <select v-model="this.pspSpecification.selectedScope" @input="handleInputChange(state.events)" class="select-box">
            <option v-for="scope in displayScopes" :key="scope.value" :value="scope.value">{{ scope.label }}</option>
          </select>
        </div>

        <div class="selection-group">
          <label class="title">Pattern Type:</label>
          <div class="radio-group">
            <div class="radio">
              <input type="radio" v-model="this.pspSpecification.selectedPatternType" value="Occurrence" id="occurrence" @change="handleTypeChange" @input="handleInputChange"/>
              <label for="occurrence">Occurrence</label>
            </div>
            <div class="radio">
              <input type="radio" v-model="this.pspSpecification.selectedPatternType" value="Order" id="order" @change="handleTypeChange" @input="handleInputChange"/>
              <label for="order">Order</label>
            </div>
          </div>
        </div>

        <div v-if="this.pspSpecification.selectedPatternType !== 'Occurrence' && this.pspSpecification.selectedPatternType !== 'Order'" class="fake-selection-group">
          <label class="title">Pattern:</label><br>
          <select v-model="this.pspSpecification.selectedOccurrence" @change="handleOccurrenceChange" @input="handleInputChange" class="select-box">
            <option v-for="occurrence in displayOccurrenceOptions" :key="occurrence.value" :value="occurrence.value">{{ occurrence.label }}</option>
          </select>
        </div>

        <div v-if="this.pspSpecification.selectedPatternType === 'Occurrence'" class="selection-group">
          <label class="title">Pattern:</label><br>
          <select v-model="this.pspSpecification.selectedOccurrence" @change="handleOccurrenceChange" @input="handleInputChange" class="select-box">
            <option v-for="occurrence in displayOccurrenceOptions" :key="occurrence.value" :value="occurrence.value">{{ occurrence.label }}</option>
          </select>
        </div>

        <div v-if="this.pspSpecification.selectedPatternType === 'Order'" class="selection-group">
          <label class="title">Pattern:</label><br>
          <select v-model="this.pspSpecification.selectedOrder" @change="handleOccurrenceChange" @input="handleInputChange" class="select-box">
            <option v-for="order in displayOrderOptions" :key="order.value" :value="order.value">{{ order.label }}</option>
          </select>
        </div>
      </div>

      <div class="grouping-container">
        <div class="selection-group">
          <input type="checkbox" id="checkboxProb" v-model="this.checkedProbability" @change="handleProbabilityChange" @input="handleInputChange">
          <label class="title" >Probability Bound</label>
        </div>

        <div class="selection-group">
          <div v-show="this.checkedProbability">
            <select v-model="this.pspSpecification.selectedProbabilityBound" @input="handleInputChange" class="select-box">
              <option v-for="prob in probabilityBoundOptions" :key="prob">{{ prob }}</option>
            </select> <br><br>
            <input v-model="this.pspSpecification.probability" :min="0" :max="1" step="0.1" type="number" placeholder="Enter Probability" @change="checkProbability" @input="handleInputChange">
          </div>
        </div>

        <div class="selection-group" :class="{ 'grayed-out': timeboundShouldGrayOut }">
          <input type="checkbox" id="checkboxTime" v-model="this.checkedTime" @change="handleTimeChange" @input="handleInputChange">
          <label class="title" >Time Bound</label>
        </div>

        <div class="selection-group">
          <div v-show="this.checkedTime && this.pspSpecification.selectedOrder !== 'Precedence' && this.pspSpecification.selectedOrder !== 'PrecedenceChain1N' && this.pspSpecification.selectedOrder !== 'PrecedenceChainN1'">
            <select v-model="this.pspSpecification.selectedTimeBound" @change="handleLimitChange" @input="handleInputChange" class="select-box">
              <option v-for="time in timeBoundOptions" :key="time">{{ time }}</option>
            </select> <br><br>
            <div v-if="this.pspSpecification.selectedTimeBound === 'Upper' ">
              <input v-model="this.pspSpecification.upperLimit" :min="0" step="1" type="number" placeholder="Within" @input="handleInputChange">
              <input v-model="this.pspSpecification.timeUnit" type="text" @input="handleInputChange">
            </div>
            <div v-if="this.pspSpecification.selectedTimeBound === 'Lower' ">
              <input v-model="this.pspSpecification.lowerLimit" :min="0" step="1" type="number" placeholder="After" @input="handleInputChange">
              <input v-model="this.pspSpecification.timeUnit" type="text" @input="handleInputChange">
            </div>
            <div v-if="this.pspSpecification.selectedTimeBound === 'Interval' ">
              <input v-model="this.pspSpecification.lowerLimit" :min="0" step="1" type="number" placeholder="Enter lower Limit" @change="checkTime" @input="handleInputChange">
              <input v-model="this.pspSpecification.upperLimit" :min="0" step="1" type="number" placeholder="Enter upper Limit" @change="checkTime" @input="handleInputChange">
              <input v-model="this.pspSpecification.timeUnit" type="text">
            </div>
          </div>
        </div>

        <div class="selection-group">
          <div v-show="this.checkedTime && (this.pspSpecification.selectedOrder === 'Precedence' || this.pspSpecification.selectedOrder === 'PrecedenceChain1N' || this.pspSpecification.selectedOrder === 'PrecedenceChainN1')">
            <select v-model="this.pspSpecification.selectedTimeBound" @change="handleLimitChange" @input="handleInputChange" class="select-box">
              <option v-for="time in this.pspSpecification.interval" :key="time">{{ time }}</option>
            </select>
            <div v-if="this.pspSpecification.selectedTimeBound === 'Interval' ">
              <input v-model="this.pspSpecification.lowerLimit" :min="0" step="1" type="number" placeholder="Enter lower Limit" @change="checkTime" @input="handleInputChange">
              <input v-model="this.pspSpecification.upperLimit" :min="0" step="1" type="number" placeholder="Enter upper Limit" @change="checkTime" @input="handleInputChange">
              <input v-model="this.pspSpecification.timeUnit" type="text" @input="handleInputChange">
            </div>
          </div>
        </div>
      </div>

      <div class="grouping-container">
        <div class="selection-group">
          <label class="title">Add Custom Event:</label> <br><br>
          <label class="subtitle">Predicate Name: </label>
          <input v-model="customPredicateName" type="text" @input="handleInputChange" class="select-event-box" /> <br><br>
          <label class="subtitle">Predicate Logic: </label>
          <select v-model="customPredicateLogic" @input="handleInputChange" class="select-box">
            <option v-for="logic in displayPredicateLogics" :key="logic.value" :value="logic.value">{{ logic.label }}</option>
          </select> <br><br>
          <label class="subtitle">Measurement Source: </label>
          <select v-model="customMeasurementSource" @input="handleInputChange" class="select-box">
            <option v-for="source in measurementSourceOptions" :key="source" :value="source">{{ source }}</option>
          </select> <br><br>
          <label class="subtitle" :class="{ 'grayed-out': comparisonValueShouldGrayOut }">Comparison Value: </label>
          <input v-model="customPredicateComparisonValue" type="text" @input="handleInputChange" :class="{ 'grayed-out': comparisonValueShouldGrayOut }" class="select-event-box" /> <br><br>
          <button class="add-event-button event-button" @click="addCustomEvent">Add Custom Event</button>
        </div>
      </div>

      <div class="grouping-container">
        <div class="selection-group">
          <label class="title">Edit an Event:</label> <br><br>
          <label class="subtitle">Choose Event: </label>
          <select v-model="this.eventToChange" @input="eventToChangeSelected">
            <option v-for="event of state.events" :key="event.event_name" :value="event">{{ event.predicate_name }}</option>
          </select> <br><br>
          <div v-if="this.eventToChange !== ''">
            <label class="subtitle">Predicate Name: </label>
            <input v-model="changedPredicateName" type="text" @input="handleInputChange" class="select-event-box" /> <br><br>
            <label class="subtitle">Predicate Logic: </label>
            <select v-model="changedPredicateLogic" @input="handleInputChange" class="select-box">
              <option v-for="logic in displayPredicateLogics" :key="logic.value" :value="logic.value">{{ logic.label }}</option>
            </select> <br><br>
            <label class="subtitle">Measurement Source: </label>
            <select v-model="changedMeasurementSource" @input="handleInputChange" class="select-box">
              <option v-for="source in measurementSourceOptions" :key="source" :value="source">{{ source }}</option>
            </select> <br><br>
            <label class="subtitle" :class="{ 'grayed-out': comparisonValueShouldGrayOut }">Comparison Value: </label>
            <input v-model="changedPredicateComparisonValue" type="text" @input="handleInputChange" :class="{ 'grayed-out': comparisonValueShouldGrayOut }" class="select-event-box" /> <br><br>
            <button class="add-event-button event-button" @click="changeEvent">Save Changes</button>
            <button class="delete-event-button event-button" @click="deleteEvent">Delete this event</button>
          </div>
        </div>
      </div>

    </div>
    <div class="selection-container">
      <div class="message-container">
        <p>Preview:</p>
        <div v-if="this.pspSpecification.selectedScope === 'Globally'">
          Globally
        </div>
        <div v-if="this.pspSpecification.selectedScope === 'BeforeR'">
          Before
          <select v-model="this.pspSpecification.selectedScopeEventR" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
        </div>
        <div v-if="this.pspSpecification.selectedScope === 'AfterQ'">
          After
          <select v-model="this.pspSpecification.selectedScopeEventQ" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
        </div>
        <div v-if="this.pspSpecification.selectedScope === 'BetweenQandR'">
          Between
          <select v-model="this.pspSpecification.selectedScopeEventQ" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
          and
          <select v-model="this.pspSpecification.selectedScopeEventR" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
        </div>
        <div v-if="this.pspSpecification.selectedScope === 'AfterQUntilR'">
          After
          <select v-model="this.pspSpecification.selectedScopeEventQ" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
          until
          <select v-model="this.pspSpecification.selectedScopeEventR" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
        </div>

        <br>

        <div v-if="this.pspSpecification.selectedOccurrence === 'SteadyState'">
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
          [holds] in the long run.
        </div>
        <div v-if="this.pspSpecification.selectedOccurrence === 'MinimumDuration'">
          once
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
          [becomes satisfied] <br>
          it remains so for at least
          <input v-model="this.pspSpecification.selectedTime" type="number" @input="handleInputChange" class="select-pattern-box" />
          <input v-model="this.pspSpecification.selectedTimeUnitType" type="text" @input="handleInputChange" class="select-pattern-box" />
        </div>
        <div v-if="this.pspSpecification.selectedOccurrence === 'MaximumDuration'">
          once
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
          [becomes satisfied] <br>
          it remains so for less than
          <input v-model="this.pspSpecification.selectedTime" type="number" @input="handleInputChange" class="select-pattern-box" />
          <input v-model="this.pspSpecification.selectedTimeUnitType" type="text" @input="handleInputChange" class="select-pattern-box" />
        </div>
        <div v-if="this.pspSpecification.selectedOccurrence === 'Recurrence'">
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
          [holds] repeatedly <br>
          [every
          <input v-model="this.pspSpecification.selectedTime" type="number" @input="handleInputChange" class="select-pattern-box" />
          <input v-model="this.pspSpecification.selectedTimeUnitType" type="text" @input="handleInputChange" class="select-pattern-box" />
          ]
        </div>
        <div v-if="this.pspSpecification.selectedOccurrence === 'Universality'">
          it is always the case that
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
          holds.
        </div>
        <div v-if="this.pspSpecification.selectedOccurrence === 'Absence'">
          it is never the case that
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
          holds.
        </div>
        <div v-if="this.pspSpecification.selectedOccurrence === 'Existence'">
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
          [holds] eventually.
        </div>
        <div v-if="this.pspSpecification.selectedOccurrence === 'BoundedExistence'">
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
          [holds] at most
          <input v-model="this.pspSpecification.selectedInterval" type="number" @input="handleInputChange" class="select-pattern-box" />
          times.
        </div>
        <div v-if="this.pspSpecification.selectedOccurrence === 'TransientState'">
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
          [holds] after
          <input v-model="this.pspSpecification.selectedTime" type="number" @input="handleInputChange" class="select-pattern-box" />
          <input v-model="this.pspSpecification.selectedTimeUnitType" type="text" @input="handleInputChange" class="select-pattern-box" />
        </div>
        <div v-if="this.pspSpecification.selectedOrder=== 'Response'">
          if
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
          [has occurred] <br>
          then in response
          <select v-model="this.pspSpecification.selectedEventS" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
          [eventually holds]. <br>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Lower' ">
            after {{ this.pspSpecification.lowerLimit }} {{ this.pspSpecification.timeUnit }}
          </div>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Upper' ">
            within {{ this.pspSpecification.upperLimit }} {{ this.pspSpecification.timeUnit }}
          </div>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Interval' ">
            between {{ this.pspSpecification.lowerLimit }} and {{ this.pspSpecification.upperLimit }} {{ this.pspSpecification.timeUnit }}
          </div>
          <select v-model="this.pspSpecification.selectedConstraintEvent" @input="handleInputChange">
            <option value="Constraint">Constraint</option>
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
        </div>
        <div :key="componentKey" v-if="this.pspSpecification.selectedOrder=== 'ResponseChain1N'">
          if
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
          [has occurred] <br>
          then in response
          <select v-model="this.pspSpecification.selectedEventS" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
          [eventually holds] <br>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Lower' ">
            after {{ this.pspSpecification.lowerLimit }} {{ this.pspSpecification.timeUnit }}
          </div>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Upper' ">
            within {{ this.pspSpecification.upperLimit }} {{ this.pspSpecification.timeUnit }}
          </div>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Interval' ">
            between {{ this.pspSpecification.lowerLimit }} and {{ this.pspSpecification.upperLimit }} {{ this.pspSpecification.timeUnit }}
          </div>
          <select v-model="this.pspSpecification.selectedConstraintEvent" @input="handleInputChange">
            <option value="Constraint">Constraint</option>
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select> <br>

          <div v-for="(chainedEvent, index) in this.pspSpecification.selectedChainedEvents" :key="index" class="chained-event-section">
            <label class="title">followed by </label>
            <select v-model="chainedEvent.event.name" @input="handleInputChange">
              <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
            </select> <br>
            <div>
              <select v-model="chainedEvent.time_bound.type" @change="handleLimitChange" @input="handleInputChange" class="select-box">
                <option value="none">---</option>
                <option v-for="time in timeBoundOptions" :key="time">{{ time }}</option>
              </select>
              <div v-if="chainedEvent.time_bound.type === 'Upper' ">
                <input v-model="chainedEvent.time_bound.upper_limit" :min="0" step="1" type="number" placeholder="Within" @input="handleInputChange">
                <input v-model="chainedEvent.time_bound.time_unit" type="text" @input="handleInputChange">
              </div>
              <div v-if="chainedEvent.time_bound.type === 'Lower' ">
                <input v-model="chainedEvent.time_bound.lower_limit" :min="0" step="1" type="number" placeholder="After" @input="handleInputChange">
                <input v-model="chainedEvent.time_bound.time_unit" type="text" @input="handleInputChange">
              </div>
              <div v-if="chainedEvent.time_bound.type === 'Interval' ">
                <input v-model="chainedEvent.time_bound.lower_limit" :min="0" step="1" type="number" placeholder="Enter lower Limit" @change="checkTime" @input="handleInputChange">
                <input v-model="chainedEvent.time_bound.upper_limit" :min="0" step="1" type="number" placeholder="Enter upper Limit" @change="checkTime" @input="handleInputChange">
                <input v-model="chainedEvent.time_bound.time_unit" type="text" @input="handleInputChange">
              </div>
            </div>
            <select v-model="chainedEvent.constrain_event.name" @input="handleInputChange">
              <option value="Constraint">Constraint</option>
              <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
            </select> <br>
            <button class="delete-chainedevent-button" @click="deleteChainedEvent(index)">Remove Chained Event</button>
          </div> <br>

          <button class="button" @click="addChainedEvent">Add Chained Event</button> <br>
          [eventually holds]
        </div>
        <div :key="componentKey" v-if="this.pspSpecification.selectedOrder=== 'ResponseChainN1'">
          if
          <select v-model="this.pspSpecification.selectedEventS" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select> <br>

          <div v-for="(chainedEvent, index) in this.pspSpecification.selectedChainedEvents" :key="index" class="chained-event-section">
            <label class="title">followed by </label>
            <select v-model="chainedEvent.event.name" @input="handleInputChange">
              <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
            </select> <br>
            <div>
              <select v-model="chainedEvent.time_bound.type" @change="handleLimitChange" @input="handleInputChange" class="select-box">
                <option value="none">---</option>
                <option v-for="time in timeBoundOptions" :key="time">{{ time }}</option>
              </select>
              <div v-if="chainedEvent.time_bound.type === 'Upper' ">
                <input v-model="chainedEvent.time_bound.upper_limit" :min="0" step="1" type="number" placeholder="Within" @input="handleInputChange">
                <input v-model="chainedEvent.time_bound.time_unit" type="text" @input="handleInputChange">
              </div>
              <div v-if="chainedEvent.time_bound.type === 'Lower' ">
                <input v-model="chainedEvent.time_bound.lower_limit" :min="0" step="1" type="number" placeholder="After" @input="handleInputChange">
                <input v-model="chainedEvent.time_bound.time_unit" type="text" @input="handleInputChange">
              </div>
              <div v-if="chainedEvent.time_bound.type === 'Interval' ">
                <input v-model="chainedEvent.time_bound.lower_limit" :min="0" step="1" type="number" placeholder="Enter lower Limit" @change="checkTime" @input="handleInputChange">
                <input v-model="chainedEvent.time_bound.upper_limit" :min="0" step="1" type="number" placeholder="Enter upper Limit" @change="checkTime" @input="handleInputChange">
                <input v-model="chainedEvent.time_bound.time_unit" type="text" @input="handleInputChange">
              </div>
            </div>
            <select v-model="chainedEvent.constrain_event.name" @input="handleInputChange">
              <option value="Constraint">Constraint</option>
              <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
            </select> <br>
            <button class="delete-chainedevent-button" @click="deleteChainedEvent(index)">Remove Chained Event</button>
          </div> <br>
          <button class="button" @click="addChainedEvent">Add Chained Event</button> <br>
          [have occured] <br>
          then in response
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
          [eventually holds] <br>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Lower' ">
            after {{ this.pspSpecification.lowerLimit }} {{ this.pspSpecification.timeUnit }}
          </div>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Upper' ">
            within {{ this.pspSpecification.upperLimit }} {{ this.pspSpecification.timeUnit }}
          </div>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Interval' ">
            between {{ this.pspSpecification.lowerLimit }} and {{ this.pspSpecification.upperLimit }} {{ this.pspSpecification.timeUnit }}
          </div>
          <select v-model="this.pspSpecification.selectedConstraintEvent" @input="handleInputChange">
            <option value="Constraint">Constraint</option>
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
        </div>
        <div v-if="this.pspSpecification.selectedOrder=== 'ResponseInvariance'">
          if
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
          [has occurred] <br>
          then in response
          <select v-model="this.pspSpecification.selectedEventS" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
          [holds] continually.
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Lower' ">
            after {{ this.pspSpecification.lowerLimit }} {{ this.pspSpecification.timeUnit }}
          </div>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Upper' ">
            within {{ this.pspSpecification.upperLimit }} {{ this.pspSpecification.timeUnit }}
          </div>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Interval' ">
            between {{ this.pspSpecification.lowerLimit }} and {{ this.pspSpecification.upperLimit }} {{ this.pspSpecification.timeUnit }}
          </div>
        </div>
        <div v-if="this.pspSpecification.selectedOrder=== 'Precedence'">
          if
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
          [holds] then it must have been the case <br>
          that
          <select v-model="this.pspSpecification.selectedEventS" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
          [has occured] <br>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Interval' ">
            between {{ this.pspSpecification.lowerLimit }} and {{ this.pspSpecification.upperLimit }} {{ this.pspSpecification.timeUnit }}
          </div>
          before
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
          [holds].
        </div>
        <div :key="componentKey" v-if="this.pspSpecification.selectedOrder=== 'PrecedenceChain1N'">
          if
          <select v-model="this.pspSpecification.selectedEventS" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
          [has occurred] <br>

          <div v-for="(chainedEvent, index) in this.pspSpecification.selectedChainedEvents" :key="index" class="chained-event-section">
            <label class="title">and afterwards </label>
            <select v-model="chainedEvent.event.name" @input="handleInputChange">
              <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
            </select> <br>
            <div>
              <div>
                <select v-model="chainedEvent.time_bound.type" @change="handleLimitChange" @input="handleInputChange" class="select-box">
                  <option value="none">---</option>
                  <option value="Upper">Upper</option>
                </select>
                <div v-if="chainedEvent.time_bound.type === 'Upper' ">
                  <input v-model="chainedEvent.time_bound.upper_limit" :min="0" step="1" type="number" placeholder="Within" @input="handleInputChange">
                  <input v-model="chainedEvent.time_bound.time_unit" type="text" @input="handleInputChange">
                </div>
              </div>
            </div>
            <select v-model="chainedEvent.constrain_event.name" @input="handleInputChange">
              <option value="Constraint">Constraint</option>
              <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
            </select> <br>
            <button class="delete-chainedevent-button" @click="deleteChainedEvent(index)">Remove Chained Event</button>
          </div> <br>

          <button class="button" @click="addChainedEvent">Add Chained Event</button> <br>

          [holds] <br>
          then it must be the case that
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
          [has occured] <br>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Interval' ">
            between {{ this.pspSpecification.lowerLimit }} and {{ this.pspSpecification.upperLimit }} {{ this.pspSpecification.timeUnit }}
          </div>
          before
          <select v-model="this.pspSpecification.selectedEventS" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select> <br>
          [holds].
          <select v-model="this.pspSpecification.selectedConstraintEvent" @input="handleInputChange">
            <option value="Constraint">Constraint</option>
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
        </div>
        <div :key="componentKey" v-if="this.pspSpecification.selectedOrder=== 'PrecedenceChainN1'">
          if
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
          [holds] <br>
          then it must be the case that
          <select v-model="this.pspSpecification.selectedEventS" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select> <br>

          <div v-for="(chainedEvent, index) in this.pspSpecification.selectedChainedEvents" :key="index" class="chained-event-section">
            <label class="title">and afterwards </label>
            <select v-model="chainedEvent.event.name" @input="handleInputChange">
              <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
            </select> <br>
            <div>
              <div>
                <select v-model="chainedEvent.time_bound.type" @change="handleLimitChange" @input="handleInputChange" class="select-box">
                  <option value="none">---</option>
                  <option value="Upper">Upper</option>
                </select>
                <div v-if="chainedEvent.time_bound.type === 'Upper' ">
                  <input v-model="chainedEvent.time_bound.upper_limit" :min="0" step="1" type="number" placeholder="Within" @input="handleInputChange">
                  <input v-model="chainedEvent.time_bound.time_unit" type="text" @input="handleInputChange">
                </div>
              </div>
            </div>
            <select v-model="chainedEvent.constrain_event.name" @input="handleInputChange">
              <option value="Constraint">Constraint</option>
              <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
            </select> <br>
            <button class="delete-chainedevent-button" @click="deleteChainedEvent(index)">Remove Chained Event</button>
          </div> <br>

          <button class="button" @click="addChainedEvent">Add Chained Event</button> <br>

          [have occurred] <br>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Interval' ">
            between {{ this.pspSpecification.lowerLimit }} and {{ this.pspSpecification.upperLimit }} {{ this.pspSpecification.timeUnit }}
          </div>
          <select v-model="this.pspSpecification.selectedConstraintEvent" @input="handleInputChange">
            <option value="Constraint">Constraint</option>
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select> <br>
          before
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
          [holds] <br>
        </div>
        <div v-if="this.pspSpecification.selectedOrder=== 'Until'">
          <select v-model="this.pspSpecification.selectedEventP" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
          [holds] without interruption until <br>
          <select v-model="this.pspSpecification.selectedEventS" @input="handleInputChange">
            <option v-for="event of state.events" :key="event.event_name" :value="event.event_name">{{ event.predicate_name }}</option>
          </select>
          [holds]
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Lower' ">
            after {{ this.pspSpecification.lowerLimit }} {{ this.pspSpecification.timeUnit }}
          </div>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Upper' ">
            within {{ this.pspSpecification.upperLimit }} {{ this.pspSpecification.timeUnit }}
          </div>
          <div v-if="this.pspSpecification.selectedTimeBound=== 'Interval' ">
            between {{ this.pspSpecification.lowerLimit }} and {{ this.pspSpecification.upperLimit }} {{ this.pspSpecification.timeUnit }}
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
            between {{ this.pspSpecification.lowerLimit }} and {{ this.pspSpecification.upperLimit }} {{ this.pspSpecification.timeUnit }}
          </div>
        </div>

        <br>

        <div v-if="this.pspSpecification.selectedProbabilityBound=== 'Lower' && this.pspSpecification.probability !== null" >
          with a probability lower than {{ this.pspSpecification.probability }}
        </div>
        <div v-if="this.pspSpecification.selectedProbabilityBound=== 'LowerEqual' && this.pspSpecification.probability !== null">
          with a probability lower or equal than {{ this.pspSpecification.probability }}
        </div>
        <div v-if="this.pspSpecification.selectedProbabilityBound=== 'Greater' && this.pspSpecification.probability !== null">
          with a probability greater than {{ this.pspSpecification.probability }}
        </div>
        <div v-if="this.pspSpecification.selectedProbabilityBound=== 'GreaterEqual' && this.pspSpecification.probability !== null">
          with a probability greater or equal than {{ this.pspSpecification.probability }}
        </div>
      </div>

      <div class="selection-group">
        <label class="title">Target Logic:</label><br>
        <select v-model="this.pspSpecification.selectedTargetLogic" @input="handleInputChange">
          <option v-for="targetLogic in targetLogicOptions" :key="targetLogic">{{ targetLogic }}</option>
        </select>
      </div>

      <div class="message-container">
        <p>Specification in Target Logic:</p>
        <div>
          <pre v-if="this.pspSpecification.mapping" style="white-space: normal;" >{{ this.pspSpecification.mapping }}</pre>
          <button @click="copyToClipboard" v-if="this.pspSpecification.mapping" class="copy-button">Copy to Clipboard</button>
        </div>
        <div class="copy-feedback" v-if="showCopyFeedback">{{ "Copied to Clipboard!" }}</div>
      </div>

      <!--
      <div>
        <button @click="confirm" v-if="this.pspSpecification.mapping" class="commit-button">Confirm</button>
      </div>
      -->

      <div :class="{ 'grayed-out': !this.pspSpecification.mapping }">
        <button @click="confirm" class="commit-button">Confirm</button>
      </div>
      <br>
    </div>
  </div>
</template>

<style scoped>

.page-container {
  display: flex;
  margin: 2vw;
}

.selection-container {
  //max-width: 100vh;
  //margin: auto;
  flex: 1;
  //border: 1px solid black;
}

.selection-group {
  margin: 1vw;
}

.fake-selection-group {
  margin: 1vw;
  pointer-events: none;
  opacity: 0.5;
}

.selection-group .title {
  font-weight: bold;
}

.grouping-container {
  border: 1px solid #ddd;
  border-radius: 1vw;
  padding-top: 0.5vw;
  padding-bottom: 1.5vw;
  margin: 1vw;
  overflow-y: auto;
}

.select-box {
  width: 15vw;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
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
  margin: 2vh;
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
  margin: 2vw;
  min-height: 6vw;
  max-height: 40vh;
  overflow-y: auto;
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

.commit-button {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 0.7vw 1.4vw;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 0.9vw;
  margin-top: 0.6vw;
  cursor: pointer;
  border-radius: 4px;
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
  font-size: 0.5vw;
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
  0% { opacity: 1; }
  100% { opacity: 0; display: none; }
}

.grayed-out {
  pointer-events: none;
  opacity: 0.5;
}

</style>