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
function createPattern(selectedPatternType, selectedOccurrence, selectedOrder, selectedEventP, selectedEventS, selectedTimeBound, selectedProbabilityBound, timeUnit, probability, upperLimit, lowerLimit) {
  const pattern = {
    type: selectedPatternType === 'Occurrence' ? selectedOccurrence : selectedOrder,
    p_event: createEvent(selectedEventP, "")
  };

  var test = false

  // include s_event if exists
  if (selectedEventS && selectedEventS.trim() !== "") {
    pattern.s_event = createEvent(selectedEventS, "")
  }

  // include chained_events if one exists
  //TODO correct check
  if (test) {
    pattern.chained_events = [
      {
        event: createEvent("", ""),
        constrain_event: createEvent("", ""),
        time_bound: createTimeBound("", "", 0, 0)
      }
    ];
  }

  // include pattern_specifications if one exists
  //TODO correct check
  if (test) {
    pattern.pattern_specifications = {
      time_unit: "",
      upper_limit: 0,
      frequency: 0
    };
  }

  // include pattern_constrains if one exists
  //TODO correct check
  
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
  
  if (test) {
    pattern.pattern_constrains = {   
          constrain_event: createEvent("", "")
    };
  }

  return pattern;
}

// creates the payload
function createPayload(selectedScope, selectedScopeEventQ, selectedScopeEventR, selectionPatternType, selectedOccurrence, selectedOrder, selectedEventP, selectedEventS, selectedTargetLogic, selectedTimeBound, selectedProbabilityBound, timeUnit, probability, upperLimit, lowerLimit) {
  return {
    scope: createScope(selectedScope, selectedScopeEventQ, selectedScopeEventR),
    pattern: createPattern(selectionPatternType, selectedOccurrence, selectedOrder, selectedEventP, selectedEventS, selectedTimeBound, selectedProbabilityBound, timeUnit, probability, upperLimit, lowerLimit),
    target_logic: selectedTargetLogic
  };
}

export default {
  data() {
    return {
      scopes: ["Globally", "BeforeR", "AfterQ", "BetweenQandR", "AfterQUntilR"],
      selectedPatternType: null,
      occurrenceOptions: ["SteadyState", "MinimumDuration", "MaximumDuration", "Recurrence", "Universality", "Absence", "Existence", "BoundedExistence", "TransientState"],
      orderOptions: ["Response", "ResponseChain1N", "ResponseChainN1", "ResponseInvariance", "Precedence", "PrecedenceChain1N", "PrecedenceChainN1", "Until"],
      events: ["EventA"],
      customEvent: "",
      targetLogics: ["SEG", "LTL", "MTL", "Prism", "Quantitative Prism", "TBV (untimed)", "TBV (timed)"],
      selectedScope: null,
      selectedOccurrence: null,
      selectedOrder: null,
      selectedScopeEventQ: null,
      selectedScopeEventR: null,
      selectedEventP: null,
      selectedEventS: null,
      selectedEvent5: null,
      selectedTimeBound: null,
      timeBoundOptions: ["Interval", "Lower", "Upper"],
      selectedProbabilityBound: null,
      upperLimit: null,
      lowerLimit: null,
      probabilityBoundOptions: ["GreaterEqual", "Greater", "LowerEqual", "Lower"],
      probability: null,
      timeUnit: "time units",
      selectedTargetLogic: "SEG",
      mapping: null,
      checkedProbability: false,
      checkedTime: false
    };
  },
  methods: {
    handleOccurrenceChange() {
      // Reset selected event when occurrence changes
      this.selectedEvent = null;
    },
    handleTypeChange() {
      // Reset preview when pattern type changes
      this.selectedOccurrence = null;
      this.selectedOrder = null;
    },
    addCustomEvent() {
      // Add the custom event to the list if it is not empty
      if (this.customEvent.trim() !== "") {
        this.events.push(this.customEvent.trim());
        // Clear the input field after adding the custom event
        this.customEvent = "";
      }
    },
    addProbability() {
      // Add the custom probabilitiy
      this.probability.push()
    },
    handleProbabilityChange() {
      // Reset probabilityBound and probability when unchecked
      this.selectedProbabilityBound = null;
      this.probability = null;
    },
    handleTimeChange() {
      // Reset timeBound and timUnit when unchecked
      this.selectedTimeBound = null;
      this.timeUnit = "time units";
    },
    handleLimitChange() {
      // Reset limits when timeBound changes
      this.upperLimit = null;
      this.lowerLimit = null;
    },
    async sendTransformRequest(payload) {
      try {
        // Perform the HTTP request with the input data
        const response = await fetch('http://localhost:8080/transformPattern', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: payload
        });

        // Update the mapping property with the response
        const responsePayload = await response.json();

        // if mapping is returned, display it, else display the error message
        if (responsePayload.payload.mapping) {
          this.mapping = responsePayload.payload.mapping
        } else {
          this.mapping = responsePayload.payload.error
        }

        // Debug
        console.log(this.mapping);
        console.log('Transformation successful!');
      } catch (error) {
        // Handle any errors that occur during the HTTP request
        console.error('Error transforming to temporal logic:', error);
      }
    },
    async transformToTemporalLogic() {

      const payload = createPayload(this.selectedScope, this.selectedScopeEventQ, this.selectedScopeEventR, this.selectedPatternType, this.selectedOccurrence, this.selectedOrder, this.selectedEventP, this.selectedEventS, this.selectedTargetLogic, this.selectedTimeBound, this.selectedProbabilityBound, this.timeUnit, this.probability, this.upperLimit, this.lowerLimit);

      console.log(payload)

      await this.sendTransformRequest(JSON.stringify(payload))
    },
  },
};
</script>

<template>
  <div class="selection-container">
    <h1>PSPWizard</h1>

    <div class="selection-group">
      <label class="title">Scope:</label>
      <select v-model="selectedScope" class="select-box">
        <option v-for="scope in scopes" :key="scope">{{ scope }}</option>
      </select>
    </div>

    <div class="selection-group">
      <label class="title">Pattern Type:</label>
      <div class="radio-group">
        <div class="radio">
          <input type="radio" v-model="selectedPatternType" value="Occurrence" id="occurrence" @change="handleTypeChange" />
          <label for="occurrence">Occurrence</label>
        </div>
        <div class="radio">
          <input type="radio" v-model="selectedPatternType" value="Order" id="order" @change="handleTypeChange" />
          <label for="order">Order</label>
        </div>
      </div>
    </div>

    <div v-if="selectedPatternType === 'Occurrence'" class="selection-group">
      <label class="title">Pattern:</label>
      <select v-model="selectedOccurrence" @change="handleOccurrenceChange" class="select-box">
        <option v-for="occurrence in occurrenceOptions" :key="occurrence">{{ occurrence }}</option>
      </select>
    </div>

    <div v-if="selectedPatternType === 'Order'" class="selection-group">
      <label class="title">Pattern:</label>
      <select v-model="selectedOrder" @change="handleOccurrenceChange" class="select-box">
        <option v-for="order in orderOptions" :key="order">{{ order }}</option>
      </select>
    </div>

    <div class="selection-group">
      <div class="check-group">
        <input type="checkbox" id="checkboxProb" v-model="checkedProbability" @change="handleProbabilityChange">
        <label class="title" >Probability Bound</label>
          <div v-show="checkedProbability">
            <select v-model="selectedProbabilityBound" class="select-box">
              <option v-for="prob in probabilityBoundOptions" :key="prob">{{ prob }}</option>
            </select>
            <input v-model="probability" :min="0" :max="1" step="0.1" type="number" placeholder="Enter Probability">
          </div>
      </div>

      <div class="selection-group">
      <div class="check-group">
        <div v-if="selectedPatternType === 'Order' || selectedOccurrence === 'Universality' || selectedOccurrence === 'Absence' || selectedOccurrence === 'Existence' || selectedOccurrence === 'BoundedExistence' " class="selection-group">
            <input type="checkbox" id="checkboxTime" v-model="checkedTime" @change="handleTimeChange">
            <label class="title" >Time Bound</label>
            <div v-show="checkedTime">
              <select v-model="selectedTimeBound" @change="handleLimitChange" class="select-box">
                <option v-for="time in timeBoundOptions" :key="time">{{ time }}</option>
              </select>
              <div v-if="selectedTimeBound === 'Upper' ">
                <input v-model="upperLimit" :min="0" step="1" type="number" placeholder="Within">
                <input v-model="timeUnit" type="text">
                
              </div>
              <div v-if="selectedTimeBound === 'Lower' ">
                <input v-model="lowerLimit" :min="0" step="1" type="number" placeholder="After">
                <input v-model="timeUnit" type="text">
              </div>
              <div v-if="selectedTimeBound === 'Interval' ">
                <input v-model="lowerLimit" :min="0" step="1" type="number" placeholder="Enter lower Limit">
                <input v-model="upperLimit" :min="0" step="1" type="number" placeholder="Enter upper Limit">
                <input v-model="timeUnit" type="text">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    

    <div class="selection-group">
      <label class="title">Add Custom Event:</label>
      <input v-model="customEvent" type="text" class="select-event-box" />
      <button class="event-button" @click="addCustomEvent">Add Custom Event</button>
    </div>

    <div class="message-container">
      <p>Preview:</p>
      <div v-if="selectedScope === 'Globally'">
        Globally
      </div>
      <div v-if="selectedScope === 'BeforeR'">
        Before
        <select v-model="selectedScopeEventQ">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
      </div>
      <div v-if="selectedScope === 'AfterQ'">
        After
        <select v-model="selectedScopeEventQ">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
      </div>
      <div v-if="selectedScope === 'BetweenQandR'">
        Between
        <select v-model="selectedScopeEventQ">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        and
        <select v-model="selectedScopeEventR">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
      </div>
      <div v-if="selectedScope === 'AfterQUntilR'">
        After
        <select v-model="selectedScopeEventQ">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        until
        <select v-model="selectedScopeEventR">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
      </div>

      <br>

      <div v-if="selectedOccurrence === 'SteadyState'">
        <select v-model="selectedEventP">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        [holds] in the long run.
      </div>
      <div v-if="selectedOccurrence === 'MinimumDuration'">
        once
        <select v-model="selectedEventP">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        [becomes satisfied] it remains so for at least //TODO
      </div>
      <div v-if="selectedOccurrence === 'MaximumDuration'">
        once
        <select v-model="selectedEventP">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        [becomes satisfied] it remains so for less than //TODO
      </div>
      <div v-if="selectedOccurrence === 'Recurrence'">
        <select v-model="selectedEventP">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        [holds] repeatedly [every //TODO]
      </div>
      <div v-if="selectedOccurrence === 'Universality'">
        it is always the case that
        <select v-model="selectedEventP">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        holds.
      </div>
      <div v-if="selectedOccurrence === 'Absence'">
        it is never the case that
        <select v-model="selectedEventP">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        holds.
      </div>
      <div v-if="selectedOccurrence === 'Existence'">
        <select v-model="selectedEventP">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        [holds] eventually.
      </div>
      <div v-if="selectedOccurrence === 'BoundedExistence'">
        <select v-model="selectedEventP">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        [holds] at most //TODO times.
      </div>
      <div v-if="selectedOccurrence === 'TransientState'">
        <select v-model="selectedEventP">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        [holds] after //TODO
      </div>
      <div v-if="selectedOrder=== 'Response'">
        if
        <select v-model="selectedEventP">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        [has occurred] then in response
        <select v-model="selectedEventS">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        [eventually holds].
      </div>
      <div v-if="selectedOrder=== 'ResponseChain1N'">
        if
        <select v-model="selectedEventP">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        [has occurred] then in response
        <select v-model="selectedEventS">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        [eventually holds] //TODO
      </div>
      <div v-if="selectedOrder=== 'ResponseChainN1'">
        if
        <select v-model="selectedEventP">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        //TODO
      </div>
      <div v-if="selectedOrder=== 'ResponseInvariance'">
        if
        <select v-model="selectedEventP">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        [has occurred] then in response
        <select v-model="selectedEventS">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        [holds] continually.
      </div>
      <div v-if="selectedOrder=== 'Precedence'">
        if
        <select v-model="selectedEventP">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        [holds] then it must have been the case that
        <select v-model="selectedEventS">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        [has occured] before
        <select v-model="selectedEvent5">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        [holds].
      </div>
      <div v-if="selectedOrder=== 'PrecedenceChain1N'">
        if
        <select v-model="selectedEventP">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        [holds] //TODO
      </div>
      <div v-if="selectedOrder=== 'PrecedenceChainN1'">
        if
        <select v-model="selectedEventP">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        [holds] then it must be the case that
        <select v-model="selectedEventS">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        //TODO
      </div>
      <div v-if="selectedOrder=== 'Until'">
        <select v-model="selectedEventP">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        [holds] without interruption until
        <select v-model="selectedEventS">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        [holds].
      </div>

      <br>

      <div v-if="selectedTimeBound=== 'Lower' ">
        after {{ lowerLimit }} {{ timeUnit }}
      </div>
      <div v-if="selectedTimeBound=== 'Upper' ">
        within {{ upperLimit }} {{ timeUnit }}
      </div>
      <div v-if="selectedTimeBound=== 'Interval' ">
        between {{ lowerLimit }} and {{ upperLimit }} {{ timeUnit }}
      </div>

      <br>

      <div v-if="selectedProbabilityBound=== 'Lower' && probability !== null" >
        with a probability lower than {{ probability }}
      </div>
      <div v-if="selectedProbabilityBound=== 'LowerEqual' && probability !== null">
        with a probability lower or equal than {{ probability }}
      </div>
      <div v-if="selectedProbabilityBound=== 'Greater' && probability !== null">
        with a probability greater than {{ probability }}
      </div>
      <div v-if="selectedProbabilityBound=== 'GreaterEqual' && probability !== null">
        with a probability greater or equal than {{ probability }}
      </div>
    </div>

    <div class="selection-group">
      <label class="title">Target Logic:</label><br>
      <select v-model="selectedTargetLogic">
        <option v-for="targetLogic in targetLogics" :key="targetLogic">{{ targetLogic }}</option>
      </select>
    </div>

    <div>
      <button class="commit-button" @click="transformToTemporalLogic">Transform to {{ selectedTargetLogic }}</button>
    </div>

    <div class="message-container">
      <p>Specification in Target Logic:</p>
      <pre v-if="mapping">{{ mapping }}</pre>
    </div>

    <br>
  </div>
</template>

<style scoped>
.selection-container {
  max-width: 600px;
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

.check-group {
  display: flex;
  justify-content: left;
}

.radio-group input {
  margin-right: 5px;
}

.radio {
  margin-right: 1vw;
}

.message-container {
  background-color: #f2f2f2;
  border: 1px solid #ddd;
  border-radius: 1vw;
  padding-top: 0.5vw;
  padding-bottom: 1.5vw;
  margin-top: 2vw;
  min-height: 6vw;
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
  background-color: #ccc; /* Green */
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
  background-color: #ccc; /* Green */
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
  background-color: #4CAF50; /* Green */
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
</style>