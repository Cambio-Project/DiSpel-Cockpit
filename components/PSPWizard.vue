<script>
//import axios from "core-js/internals/queue";

// creates the scope part of the payload
function createScope(selectedScope, selectedScopeEventQ, selectedScopeEventR) {
  const scope = {
    type: selectedScope
  };

  // include q_event if it exists
  if (selectedScopeEventQ && selectedScopeEventQ.trim() !== "") {
    scope.q_event = createEvent(selectedScopeEventQ, "");
  }

  // include r_event if it exists
  if (selectedScopeEventR && selectedScopeEventR.trim() !== "") {
    scope.r_event = createEvent(selectedScopeEventR, "");
  }

  return scope;
}

// creates the event part of the payload
function createEvent(name, specification) {
  return {
    name: name,
    specification: specification
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
function createPattern(selectedPatternType, selectedOccurrence, selectedOrder, selectedEventP, selectedEventS, selectedChainedEvents, selectedTime, selectedTimeUnitType, selectedInterval, selectedConstraintEvent, selectedTimeBound, selectedProbabilityBound, timeUnit, probability, upperLimit, lowerLimit) {
  const pattern = {
    type: selectedPatternType === 'Occurrence' ? selectedOccurrence : selectedOrder,
    p_event: createEvent(selectedEventP, "")
  };

  // include s_event if exists
  if (selectedEventS && selectedEventS.trim() !== "") {
    pattern.s_event = createEvent(selectedEventS, "")
  }

  // include chained_events if one exists
  if (!selectedChainedEvents.isEmpty) {
    pattern.chained_events = selectedChainedEvents.map(chainedEvent => {

      let ch_event = {
        // event is required
        event: createEvent(chainedEvent.event.name, ""),
        //constrain_event: createEvent(chainedEvent.constrain_event.name, ""),
        //time_bound: time_bound(chainedEvent)
      };

      // constrain_event is optional
      if (chainedEvent.constrain_event && chainedEvent.constrain_event.name !== "Constraint") {
        ch_event.constrain_event = createEvent(chainedEvent.constrain_event.name, "")
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
      pattern.pattern_constrains.constrain_event = createEvent(selectedConstraintEvent, "")
    }
  }

  return pattern;
}

// creates the payload
function createPayload(selectedScope, selectedScopeEventQ, selectedScopeEventR, selectionPatternType, selectedOccurrence, selectedOrder, selectedEventP, selectedEventS, selectedChainedEvents, selectedTime, selectedTimeUnitType, selectedInterval, selectedConstraintEvent, selectedTargetLogic, selectedTimeBound, selectedProbabilityBound, timeUnit, probability, upperLimit, lowerLimit) {
  return {
    scope: createScope(selectedScope, selectedScopeEventQ, selectedScopeEventR),
    pattern: createPattern(selectionPatternType, selectedOccurrence, selectedOrder, selectedEventP, selectedEventS, selectedChainedEvents, selectedTime, selectedTimeUnitType, selectedInterval, selectedConstraintEvent, selectedTimeBound, selectedProbabilityBound, timeUnit, probability, upperLimit, lowerLimit),
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
      events: ["A(a)"],
      customEvent: "",
      scopeOptions: ["Globally", "BeforeR", "AfterQ", "BetweenQandR", "AfterQUntilR"],
      occurrenceOptions: ["SteadyState", "MinimumDuration", "MaximumDuration", "Recurrence", "Universality", "Absence", "Existence", "BoundedExistence", "TransientState"],
      orderOptions: ["Response", "ResponseChain1N", "ResponseChainN1", "ResponseInvariance", "Precedence", "PrecedenceChain1N", "PrecedenceChainN1", "Until"],
      targetLogicOptions: ["SEL", "LTL", "MTL", "Prism", "Quantitative Prism", "TBV (untimed)", "TBV (timed)"],
      checkedProbability: false,
      checkedTime: false,
      timeBoundOptions: ["Interval", "Lower", "Upper"],
      probabilityBoundOptions: ["GreaterEqual", "Greater", "LowerEqual", "Lower"],
      showCopyFeedback: false,
      componentKey: 0,
      jsonData: null
    };
  },
  computed: {
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
    }
  },
  methods: {
    handleOccurrenceChange() {
      // Reset selected event when occurrence changes
      this.pspSpecification.selectedEvent = null;
    },
    handleTypeChange() {
      // Reset preview when pattern type changes
      this.pspSpecification.selectedOccurrence = null;
      this.pspSpecification.selectedOrder = null;
    },
    addCustomEvent() {
      // Add the custom event to the list if it is not empty
      if (this.customEvent.trim() !== "") {
        this.events.push(this.customEvent.trim());
        // Clear the input field after adding the custom event
        this.customEvent = "";
      }
    },
    addSampleEvents() {
      if (!this.events.includes("B(b)")) {
        this.events.push("B(b)", "C(c)", "D(d)", "P", "S", "T")
      }
      this.forceRerender()
    },
    addProbability() {
      // Add the custom probabilitiy
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

      const payload = createPayload(this.pspSpecification.selectedScope, this.pspSpecification.selectedScopeEventQ, this.pspSpecification.selectedScopeEventR, this.pspSpecification.selectedPatternType, this.pspSpecification.selectedOccurrence, this.pspSpecification.selectedOrder, this.pspSpecification.selectedEventP, this.pspSpecification.selectedEventS, this.pspSpecification.selectedChainedEvents, this.pspSpecification.selectedTime, this.pspSpecification.selectedTimeUnitType, this.pspSpecification.selectedInterval, this.pspSpecification.selectedConstraintEvent, this.pspSpecification.selectedTargetLogic, this.pspSpecification.selectedTimeBound, this.pspSpecification.selectedProbabilityBound, this.pspSpecification.timeUnit, this.pspSpecification.probability, this.pspSpecification.upperLimit, this.pspSpecification.lowerLimit);

      console.log(payload)
      console.log(this.pspSpecification.selectedChainedEvents)

      await this.sendTransformRequest(JSON.stringify(payload))

      this.forceRerender()
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
    // used for the specification import
    handleFileChange() {
      const fileInput = this.$refs.fileInput;

      if (!fileInput.files.length) {
        console.warn('No file selected');
        return;
      }

      const file = fileInput.files[0];
      const fileReader = new FileReader();

      fileReader.onload = () => {
        try {
          const jsonData = JSON.parse(fileReader.result);
          this.jsonData = JSON.stringify(jsonData, null, 2);

          console.log(jsonData);

          // scope
          this.pspSpecification.selectedScope = jsonData.scope.type
          if (jsonData.scope.q_event && jsonData.scope.q_event.name) {
            this.events.push(jsonData.scope.q_event.name)
            this.pspSpecification.selectedScopeEventQ = jsonData.scope.q_event.name
          }
          if (jsonData.scope.r_event && jsonData.scope.r_event.name) {
            this.events.push(jsonData.scope.r_event.name)
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
            this.events.push(jsonData.pattern.p_event.name)
            this.pspSpecification.selectedEventP = jsonData.pattern.p_event.name
          }
          if (jsonData.pattern.s_event && jsonData.pattern.s_event.name) {
            this.events.push(jsonData.pattern.s_event.name)
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
              this.events.push(jsonData.pattern.pattern_constrains.constrain_event.name)
              this.pspSpecification.selectedConstraintEvent = jsonData.pattern.pattern_constrains.constrain_event.name
            }
          }
          // pattern chained events
          if (jsonData.pattern.chained_events && jsonData.pattern.chained_events.length > 0) {
            // for every chained event in array "chained_events"
            for (const chEventJson of jsonData.pattern.chained_events) {

              const chainedEvent = {}

              // event is required
              this.events.push(chEventJson.event.name)
              chainedEvent.event = {
                name: chEventJson.event && chEventJson.event.name || "",
                specification: chEventJson.event && chEventJson.event.specification || ""
              }
              // constrain_event is optional
              if (chEventJson.constrain_event) {
                this.events.push(chEventJson.constrain_event.name)
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

          this.transformToTemporalLogic()

        } catch (error) {
          // mapping not valid
          this.pspSpecification.mapping = `The imported mapping is not valid! Technical error message: \n `+error
          console.error('Error parsing JSON:', error);
        }
      };

      fileReader.readAsText(file);

      this.forceRerender()
    },
    forceRerender() {
      this.componentKey += 1;
    },
    confirm() {
      if (this.$store.state.outputType === 'Stimulus') {
        this.$store.commit('addStimulus', this.pspSpecification.mapping)
        this.$router.push('/scenarioeditorSite');
      }
      if (this.$store.state.outputType === 'Response') {
        this.$store.commit('addResponse', this.pspSpecification.mapping)
        this.$router.push('/scenarioeditorSite');
      }
    },
  },
};

</script>

<template :key="componentKey">
  <div class="selection-container">
    <h1>PSPWizard as {{ outputType }}</h1>

    <div>
      <input type="file" ref="fileInput" @change="handleFileChange">
    </div>

    <div class="selection-group">
      <label class="title">Scope:</label>
      <select v-model="this.pspSpecification.selectedScope" class="select-box">
        <option v-for="scope in displayScopes" :key="scope.value" :value="scope.value">{{ scope.label }}</option>
      </select>
    </div>

    <div class="selection-group">
      <label class="title">Pattern Type:</label>
      <div class="radio-group">
        <div class="radio">
          <input type="radio" v-model="this.pspSpecification.selectedPatternType" value="Occurrence" id="occurrence" @change="handleTypeChange" />
          <label for="occurrence">Occurrence</label>
        </div>
        <div class="radio">
          <input type="radio" v-model="this.pspSpecification.selectedPatternType" value="Order" id="order" @change="handleTypeChange" />
          <label for="order">Order</label>
        </div>
      </div>
    </div>

    <div v-if="this.pspSpecification.selectedPatternType === 'Occurrence'" class="selection-group">
      <label class="title">Pattern:</label>
      <select v-model="this.pspSpecification.selectedOccurrence" @change="handleOccurrenceChange" class="select-box">
        <option v-for="occurrence in displayOccurrenceOptions" :key="occurrence.value" :value="occurrence.value">{{ occurrence.label }}</option>
      </select>
    </div>

    <div v-if="this.pspSpecification.selectedPatternType === 'Order'" class="selection-group">
      <label class="title">Pattern:</label>
      <select v-model="this.pspSpecification.selectedOrder" @change="handleOccurrenceChange" class="select-box">
        <option v-for="order in displayOrderOptions" :key="order.value" :value="order.value">{{ order.label }}</option>
      </select>
    </div>

    <div class="selection-group">
      <input type="checkbox" id="checkboxProb" v-model="this.checkedProbability" @change="handleProbabilityChange">
      <label class="title" >Probability Bound</label>
    </div>

    <div class="selection-group">
      <div v-show="this.checkedProbability">
        <select v-model="this.pspSpecification.selectedProbabilityBound" class="select-box">
          <option v-for="prob in probabilityBoundOptions" :key="prob">{{ prob }}</option>
        </select>
        <input v-model="this.pspSpecification.probability" :min="0" :max="1" step="0.1" type="number" placeholder="Enter Probability" @change="checkProbability">
      </div>
    </div>

    <div class="selection-group">
      <div v-if="this.pspSpecification.selectedPatternType === 'Order' || this.pspSpecification.selectedOccurrence === 'Universality' || this.pspSpecification.selectedOccurrence === 'Absence' || this.pspSpecification.selectedOccurrence === 'Existence' || this.pspSpecification.selectedOccurrence === 'BoundedExistence' " class="selection-group">
        <input type="checkbox" id="checkboxTime" v-model="this.checkedTime" @change="handleTimeChange">
        <label class="title" >Time Bound</label>
      </div>
    </div>

    <div class="selection-group">
      <div v-show="this.checkedTime && this.pspSpecification.selectedOrder !== 'Precedence' && this.pspSpecification.selectedOrder !== 'PrecedenceChain1N' && this.pspSpecification.selectedOrder !== 'PrecedenceChainN1'">
        <select v-model="this.pspSpecification.selectedTimeBound" @change="handleLimitChange" class="select-box">
          <option v-for="time in timeBoundOptions" :key="time">{{ time }}</option>
        </select>
        <div v-if="this.pspSpecification.selectedTimeBound === 'Upper' ">
          <input v-model="this.pspSpecification.upperLimit" :min="0" step="1" type="number" placeholder="Within">
          <input v-model="this.pspSpecification.timeUnit" type="text">
        </div>
        <div v-if="this.pspSpecification.selectedTimeBound === 'Lower' ">
          <input v-model="this.pspSpecification.lowerLimit" :min="0" step="1" type="number" placeholder="After">
          <input v-model="this.pspSpecification.timeUnit" type="text">
        </div>
        <div v-if="this.pspSpecification.selectedTimeBound === 'Interval' ">
          <input v-model="this.pspSpecification.lowerLimit" :min="0" step="1" type="number" placeholder="Enter lower Limit" @change="checkTime">
          <input v-model="this.pspSpecification.upperLimit" :min="0" step="1" type="number" placeholder="Enter upper Limit" @change="checkTime">
          <input v-model="this.pspSpecification.timeUnit" type="text">
        </div>
      </div>
    </div>

    <div class="selection-group">
      <div v-show="this.checkedTime && (this.pspSpecification.selectedOrder === 'Precedence' || this.pspSpecification.selectedOrder === 'PrecedenceChain1N' || this.pspSpecification.selectedOrder === 'PrecedenceChainN1')">
        <select v-model="this.pspSpecification.selectedTimeBound" @change="handleLimitChange" class="select-box">
          <option v-for="time in this.pspSpecification.interval" :key="time">{{ time }}</option>
        </select>
        <div v-if="this.pspSpecification.selectedTimeBound === 'Interval' ">
          <input v-model="this.pspSpecification.lowerLimit" :min="0" step="1" type="number" placeholder="Enter lower Limit" @change="checkTime">
          <input v-model="this.pspSpecification.upperLimit" :min="0" step="1" type="number" placeholder="Enter upper Limit" @change="checkTime">
          <input v-model="this.pspSpecification.timeUnit" type="text">
        </div>
      </div>
    </div>

    <div class="selection-group">
      <label class="title">Add Custom Event:</label>
      <input v-model="customEvent" type="text" class="select-event-box" />
      <button class="event-button" @click="addCustomEvent">Add Custom Event</button>
      <button class="event-button" @click="addSampleEvents">Add Sample Events</button>
    </div>

    <div class="message-container">
      <p>Preview:</p>
      <div v-if="this.pspSpecification.selectedScope === 'Globally'">
        Globally
      </div>
      <div v-if="this.pspSpecification.selectedScope === 'BeforeR'">
        Before
        <select v-model="this.pspSpecification.selectedScopeEventR">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select>
      </div>
      <div v-if="this.pspSpecification.selectedScope === 'AfterQ'">
        After
        <select v-model="this.pspSpecification.selectedScopeEventQ">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select>
      </div>
      <div v-if="this.pspSpecification.selectedScope === 'BetweenQandR'">
        Between
        <select v-model="this.pspSpecification.selectedScopeEventQ">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select>
        and
        <select v-model="this.pspSpecification.selectedScopeEventR">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select>
      </div>
      <div v-if="this.pspSpecification.selectedScope === 'AfterQUntilR'">
        After
        <select v-model="this.pspSpecification.selectedScopeEventQ">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select>
        until
        <select v-model="this.pspSpecification.selectedScopeEventR">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select>
      </div>

      <br>

      <div v-if="this.pspSpecification.selectedOccurrence === 'SteadyState'">
        <select v-model="this.pspSpecification.selectedEventP">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select>
        [holds] in the long run.
      </div>
      <div v-if="this.pspSpecification.selectedOccurrence === 'MinimumDuration'">
        once
        <select v-model="this.pspSpecification.selectedEventP">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select>
        [becomes satisfied] <br>
        it remains so for at least
        <input v-model="this.pspSpecification.selectedTime" type="number" class="select-pattern-box" />
        <input v-model="this.pspSpecification.selectedTimeUnitType" type="text" class="select-pattern-box" />
      </div>
      <div v-if="this.pspSpecification.selectedOccurrence === 'MaximumDuration'">
        once
        <select v-model="this.pspSpecification.selectedEventP">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select>
        [becomes satisfied] <br>
        it remains so for less than
        <input v-model="this.pspSpecification.selectedTime" type="number" class="select-pattern-box" />
        <input v-model="this.pspSpecification.selectedTimeUnitType" type="text" class="select-pattern-box" />
      </div>
      <div v-if="this.pspSpecification.selectedOccurrence === 'Recurrence'">
        <select v-model="this.pspSpecification.selectedEventP">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select>
        [holds] repeatedly <br>
        [every
        <input v-model="this.pspSpecification.selectedTime" type="number" class="select-pattern-box" />
        <input v-model="this.pspSpecification.selectedTimeUnitType" type="text" class="select-pattern-box" />
        ]
      </div>
      <div v-if="this.pspSpecification.selectedOccurrence === 'Universality'">
        it is always the case that
        <select v-model="this.pspSpecification.selectedEventP">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select>
        holds.
      </div>
      <div v-if="this.pspSpecification.selectedOccurrence === 'Absence'">
        it is never the case that
        <select v-model="this.pspSpecification.selectedEventP">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select>
        holds.
      </div>
      <div v-if="this.pspSpecification.selectedOccurrence === 'Existence'">
        <select v-model="this.pspSpecification.selectedEventP">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select>
        [holds] eventually.
      </div>
      <div v-if="this.pspSpecification.selectedOccurrence === 'BoundedExistence'">
        <select v-model="this.pspSpecification.selectedEventP">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select>
        [holds] at most
        <input v-model="this.pspSpecification.selectedInterval" type="number" class="select-pattern-box" />
        times.
      </div>
      <div v-if="this.pspSpecification.selectedOccurrence === 'TransientState'">
        <select v-model="this.pspSpecification.selectedEventP">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select>
        [holds] after
        <input v-model="this.pspSpecification.selectedTime" type="number" class="select-pattern-box" />
        <input v-model="this.pspSpecification.selectedTimeUnitType" type="text" class="select-pattern-box" />
      </div>
      <div v-if="this.pspSpecification.selectedOrder=== 'Response'">
        if
        <select v-model="this.pspSpecification.selectedEventP">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select>
        [has occurred] <br>
        then in response
        <select v-model="this.pspSpecification.selectedEventS">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
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
        <select v-model="this.pspSpecification.selectedConstraintEvent">
          <option value="Constraint">Constraint</option>
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select>
      </div>
      <div :key="componentKey" v-if="this.pspSpecification.selectedOrder=== 'ResponseChain1N'">
        if
        <select v-model="this.pspSpecification.selectedEventP">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select>
        [has occurred] <br>
        then in response
        <select v-model="this.pspSpecification.selectedEventS">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
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
        <select v-model="this.pspSpecification.selectedConstraintEvent">
          <option value="Constraint">Constraint</option>
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select> <br>

        <div v-for="(chainedEvent, index) in this.pspSpecification.selectedChainedEvents" :key="index" class="chained-event-section">
          <label class="title">followed by </label>
          <select v-model="chainedEvent.event.name">
            <option v-for="event in this.events" :key="event">{{ event }}</option>
          </select> <br>
          <div>
            <select v-model="chainedEvent.time_bound.type" @change="handleLimitChange" class="select-box">
              <option value="none">---</option>
              <option v-for="time in timeBoundOptions" :key="time">{{ time }}</option>
            </select>
            <div v-if="chainedEvent.time_bound.type === 'Upper' ">
              <input v-model="chainedEvent.time_bound.upper_limit" :min="0" step="1" type="number" placeholder="Within">
              <input v-model="chainedEvent.time_bound.time_unit" type="text">
            </div>
            <div v-if="chainedEvent.time_bound.type === 'Lower' ">
              <input v-model="chainedEvent.time_bound.lower_limit" :min="0" step="1" type="number" placeholder="After">
              <input v-model="chainedEvent.time_bound.time_unit" type="text">
            </div>
            <div v-if="chainedEvent.time_bound.type === 'Interval' ">
              <input v-model="chainedEvent.time_bound.lower_limit" :min="0" step="1" type="number" placeholder="Enter lower Limit" @change="checkTime">
              <input v-model="chainedEvent.time_bound.upper_limit" :min="0" step="1" type="number" placeholder="Enter upper Limit" @change="checkTime">
              <input v-model="chainedEvent.time_bound.time_unit" type="text">
            </div>
          </div>
          <select v-model="chainedEvent.constrain_event.name">
            <option value="Constraint">Constraint</option>
            <option v-for="event in this.events" :key="event">{{ event }}</option>
          </select>
        </div> <br>

        <button class="button" @click="addChainedEvent">Add Chained Event</button> <br>
        [eventually holds]
      </div>
      <div :key="componentKey" v-if="this.pspSpecification.selectedOrder=== 'ResponseChainN1'">
        if
        <select v-model="this.pspSpecification.selectedEventS">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select> <br>

        <div v-for="(chainedEvent, index) in this.pspSpecification.selectedChainedEvents" :key="index" class="chained-event-section">
          <label class="title">followed by </label>
          <select v-model="chainedEvent.event.name">
            <option v-for="event in this.events" :key="event">{{ event }}</option>
          </select> <br>
          <div>
            <select v-model="chainedEvent.time_bound.type" @change="handleLimitChange" class="select-box">
              <option value="none">---</option>
              <option v-for="time in timeBoundOptions" :key="time">{{ time }}</option>
            </select>
            <div v-if="chainedEvent.time_bound.type === 'Upper' ">
              <input v-model="chainedEvent.time_bound.upper_limit" :min="0" step="1" type="number" placeholder="Within">
              <input v-model="chainedEvent.time_bound.time_unit" type="text">
            </div>
            <div v-if="chainedEvent.time_bound.type === 'Lower' ">
              <input v-model="chainedEvent.time_bound.lower_limit" :min="0" step="1" type="number" placeholder="After">
              <input v-model="chainedEvent.time_bound.time_unit" type="text">
            </div>
            <div v-if="chainedEvent.time_bound.type === 'Interval' ">
              <input v-model="chainedEvent.time_bound.lower_limit" :min="0" step="1" type="number" placeholder="Enter lower Limit" @change="checkTime">
              <input v-model="chainedEvent.time_bound.upper_limit" :min="0" step="1" type="number" placeholder="Enter upper Limit" @change="checkTime">
              <input v-model="chainedEvent.time_bound.time_unit" type="text">
            </div>
          </div>
          <select v-model="chainedEvent.constrain_event.name">
            <option value="Constraint">Constraint</option>
            <option v-for="event in this.events" :key="event">{{ event }}</option>
          </select>
        </div> <br>
        <button class="button" @click="addChainedEvent">Add Chained Event</button> <br>

        [have occured] <br>
        then in response
        <select v-model="this.pspSpecification.selectedEventP">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
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
        <select v-model="this.pspSpecification.selectedConstraintEvent">
          <option value="Constraint">Constraint</option>
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select>
      </div>
      <div v-if="this.pspSpecification.selectedOrder=== 'ResponseInvariance'">
        if
        <select v-model="this.pspSpecification.selectedEventP">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select>
        [has occurred] <br>
        then in response
        <select v-model="this.pspSpecification.selectedEventS">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
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
        <select v-model="this.pspSpecification.selectedEventP">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select>
        [holds] then it must have been the case <br>
        that
        <select v-model="this.pspSpecification.selectedEventS">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select>
        [has occured] <br>
        <div v-if="this.pspSpecification.selectedTimeBound=== 'Interval' ">
          between {{ this.pspSpecification.lowerLimit }} and {{ this.pspSpecification.upperLimit }} {{ this.pspSpecification.timeUnit }}
        </div>
        before
        <select v-model="this.pspSpecification.selectedEventP">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select>
        [holds].
      </div>
      <div :key="componentKey" v-if="this.pspSpecification.selectedOrder=== 'PrecedenceChain1N'">
        if
        <select v-model="this.pspSpecification.selectedEventS">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select>
        [has occurred] <br>

        <div v-for="(chainedEvent, index) in this.pspSpecification.selectedChainedEvents" :key="index" class="chained-event-section">
          <label class="title">and afterwards </label>
          <select v-model="chainedEvent.event.name">
            <option v-for="event in this.events" :key="event">{{ event }}</option>
          </select> <br>
          <div>
            <div>
              <select v-model="chainedEvent.time_bound.type" @change="handleLimitChange" class="select-box">
                <option value="none">---</option>
                <option value="Upper">Upper</option>
              </select>
              <div v-if="chainedEvent.time_bound.type === 'Upper' ">
                <input v-model="chainedEvent.time_bound.upper_limit" :min="0" step="1" type="number" placeholder="Within">
                <input v-model="chainedEvent.time_bound.time_unit" type="text">
              </div>
            </div>
          </div>
          <select v-model="chainedEvent.constrain_event.name">
            <option value="Constraint">Constraint</option>
            <option v-for="event in this.events" :key="event">{{ event }}</option>
          </select>
        </div> <br>

        <button class="button" @click="addChainedEvent">Add Chained Event</button> <br>

        [holds] <br>
        then it must be the case that
        <select v-model="this.pspSpecification.selectedEventP">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select>
        [has occured] <br>
        <div v-if="this.pspSpecification.selectedTimeBound=== 'Interval' ">
          between {{ this.pspSpecification.lowerLimit }} and {{ this.pspSpecification.upperLimit }} {{ this.pspSpecification.timeUnit }}
        </div>
        before
        <select v-model="this.pspSpecification.selectedEventS">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select> <br>
        [holds].
        <select v-model="this.pspSpecification.selectedConstraintEvent">
          <option value="Constraint">Constraint</option>
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select>
      </div>
      <div :key="componentKey" v-if="this.pspSpecification.selectedOrder=== 'PrecedenceChainN1'">
        if
        <select v-model="this.pspSpecification.selectedEventP">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select>
        [holds] <br>
        then it must be the case that
        <select v-model="this.pspSpecification.selectedEventS">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select> <br>

        <div v-for="(chainedEvent, index) in this.pspSpecification.selectedChainedEvents" :key="index" class="chained-event-section">
          <label class="title">and afterwards </label>
          <select v-model="chainedEvent.event.name">
            <option v-for="event in this.events" :key="event">{{ event }}</option>
          </select> <br>
          <div>
            <div>
              <select v-model="chainedEvent.time_bound.type" @change="handleLimitChange" class="select-box">
                <option value="none">---</option>
                <option value="Upper">Upper</option>
              </select>
              <div v-if="chainedEvent.time_bound.type === 'Upper' ">
                <input v-model="chainedEvent.time_bound.upper_limit" :min="0" step="1" type="number" placeholder="Within">
                <input v-model="chainedEvent.time_bound.time_unit" type="text">
              </div>
            </div>
          </div>
          <select v-model="chainedEvent.constrain_event.name">
            <option value="Constraint">Constraint</option>
            <option v-for="event in this.events" :key="event">{{ event }}</option>
          </select>
        </div> <br>

        <button class="button" @click="addChainedEvent">Add Chained Event</button> <br>

        [have occurred] <br>
        <div v-if="this.pspSpecification.selectedTimeBound=== 'Interval' ">
          between {{ this.pspSpecification.lowerLimit }} and {{ this.pspSpecification.upperLimit }} {{ this.pspSpecification.timeUnit }}
        </div>
        <select v-model="this.pspSpecification.selectedConstraintEvent">
          <option value="Constraint">Constraint</option>
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select> <br>
        before
        <select v-model="this.pspSpecification.selectedEventP">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select>
        [holds] <br>
      </div>
      <div v-if="this.pspSpecification.selectedOrder=== 'Until'">
        <select v-model="this.pspSpecification.selectedEventP">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
        </select>
        [holds] without interruption until <br>
        <select v-model="this.pspSpecification.selectedEventS">
          <option v-for="event in this.events" :key="event">{{ event }}</option>
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
      <select v-model="this.pspSpecification.selectedTargetLogic">
        <option v-for="targetLogic in targetLogicOptions" :key="targetLogic">{{ targetLogic }}</option>
      </select>
    </div>

    <div>
      <button class="commit-button" @click="transformToTemporalLogic">Transform to {{ this.pspSpecification.selectedTargetLogic }}</button>
    </div>

    <div class="message-container">
      <p>Specification in Target Logic:</p>
      <div :key="componentKey">
        <pre v-if="this.pspSpecification.mapping" style="white-space: normal;" >{{ this.pspSpecification.mapping }}</pre>
        <button @click="copyToClipboard" v-if="this.pspSpecification.mapping" class="copy-button">Copy to Clipboard</button>
      </div>
      <div class="copy-feedback" v-if="showCopyFeedback">{{ "Copied to Clipboard!" }}</div>
    </div>
    <div>
      <button @click="confirm" v-if="this.pspSpecification.mapping" class="commit-button">Confirm</button>
    </div>
    <br>
  </div>
</template>

<style scoped>
.selection-container {
  max-width: 50vh;
  margin: auto;
}

.selection-group {
  margin: 1vw;
}

.selection-group .title {
  font-weight: bold;
}

.select-box {
  width: 100%;
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
  width: 50%;
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

.chained-event-section {
  background-color: #dedede;
  border: 1px solid #c5c5c5;
  border-radius: 0.5vw;
  padding: 1vw;
  margin-bottom: 1vw;
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

.selected-options {
  margin-top: 20px;
  font-weight: bold;
}

.button-group {
  display: flex;
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
  padding: 0.7vw 1.4vw;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 0.8vw;
  margin: 0.6vw;
  cursor: pointer;
  border-radius: 4px;
  width: 10vw;
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
  background-color: #45a049;
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

</style>