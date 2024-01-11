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

/*
// creates the time_bound part of the payload
function createTimeBound(type, timeUnit, upperLimit, lowerLimit) {
  return {
    type: type,
    time_unit: timeUnit,
    upper_limit: upperLimit,
    lower_limit: lowerLimit
  };
}
 */

// creates the pattern part of the payload
function createPattern(selectedPatternType, selectedOccurrence, selectedOrder, selectedEventP, selectedEventS, selectedChainedEvents, selectedTime, selectedTimeUnitType, selectedInterval, selectedConstraintEvent) {
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
  if (!test) {
    pattern.chained_events = selectedChainedEvents.map(chainedEvent => {
      return {
        event: createEvent(chainedEvent.event.name, ""),
        constrain_event: createEvent(chainedEvent.constrain_event.name, ""),
        time_bound: {
          type: chainedEvent.time_bound.type,
          upper_limit: chainedEvent.time_bound.upper_limit,
          time_unit: chainedEvent.time_bound.time_unit
        }
      };
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

  // include pattern_constrains if one exists (Response always needs constrainEvent)
  //TODO correct check
  if ((selectedConstraintEvent && selectedConstraintEvent != "Constraint") || test) {
    pattern.pattern_constrains = {
      /*
      time_bound: createTimeBound("", "", 0, 0),
      probability_bound: {
        type: "",
        probability: 0
      }
       */
    };

    if (selectedConstraintEvent) {
      pattern.pattern_constrains.constrain_event = createEvent(selectedConstraintEvent, "")
    }
  }

  return pattern;
}

// creates the payload
function createPayload(selectedScope, selectedScopeEventQ, selectedScopeEventR, selectionPatternType, selectedOccurrence, selectedOrder, selectedEventP, selectedEventS, selectedChainedEvents, selectedTime, selectedTimeUnitType, selectedInterval, selectedConstraintEvent, selectedTargetLogic) {
  return {
    scope: createScope(selectedScope, selectedScopeEventQ, selectedScopeEventR),
    pattern: createPattern(selectionPatternType, selectedOccurrence, selectedOrder, selectedEventP, selectedEventS, selectedChainedEvents, selectedTime, selectedTimeUnitType, selectedInterval, selectedConstraintEvent),
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
      targetLogics: ["SEL", "LTL", "MTL", "Prism", "Quantitative Prism", "TBV (untimed)", "TBV (timed)"],
      selectedScope: null,
      selectedOccurrence: null,
      selectedOrder: null,
      selectedScopeEventQ: null,
      selectedScopeEventR: null,
      selectedEventP: null,
      selectedEventS: null,
      selectedEvent5: null,
      selectedChainedEvents: [],
      selectedConstraintEvent: null,
      selectedTime: null,
      selectedInterval: null,
      selectedTimeUnitType: "time units",
      selectedTargetLogic: "SEL",
      mapping: null,
      showCopyFeedback: false
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
      return this.scopes.map(scope => ({ label: scopeMap[scope], value: scope }));
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
        console.log(responsePayload)
        console.log(this.mapping);
        console.log('Transformation successful!');
      } catch (error) {
        // Handle any errors that occur during the HTTP request
        console.error('Error transforming to temporal logic:', error);
      }
    },
    async transformToTemporalLogic() {

      const payload = createPayload(this.selectedScope, this.selectedScopeEventQ, this.selectedScopeEventR, this.selectedPatternType, this.selectedOccurrence, this.selectedOrder, this.selectedEventP, this.selectedEventS, this.selectedChainedEvents, this.selectedTime, this.selectedTimeUnitType, this.selectedInterval, this.selectedConstraintEvent, this.selectedTargetLogic);

      console.log(payload)
      console.log(this.selectedChainedEvents)

      await this.sendTransformRequest(JSON.stringify(payload))
    },
    copyToClipboard() {
      const textarea = document.createElement("textarea");
      textarea.value = this.mapping;
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
      this.selectedChainedEvents.push({
        event: {
          //name: "",
          //specification: ""
        },
        constrain_event: {
          //name: "",
          //specification: ""
        },
        time_bound: {
          //time_unit: "",
          //type: ""
        }
      });
    }
  },
};
</script>

<template>
  <div class="selection-container">
    <h1>PSPWizard</h1>

    <div class="selection-group">
      <label class="title">Scope:</label>
      <select v-model="selectedScope" class="select-box">
        <option v-for="scope in displayScopes" :key="scope.value" :value="scope.value">{{ scope.label }}</option>
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
        <option v-for="occurrence in displayOccurrenceOptions" :key="occurrence.value" :value="occurrence.value">{{ occurrence.label }}</option>
      </select>
    </div>

    <div v-if="selectedPatternType === 'Order'" class="selection-group">
      <label class="title">Pattern:</label>
      <select v-model="selectedOrder" @change="handleOccurrenceChange" class="select-box">
        <option v-for="order in displayOrderOptions" :key="order.value" :value="order.value">{{ order.label }}</option>
      </select>
    </div>

    <div class="selection-group">
      <div class="button-group">
        <button class="button" @click="test">Time Bound</button>
        <button class="button" @click="test">Probability Bound</button>
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
        [becomes satisfied] it remains so for at least
        <input v-model="selectedTime" type="number" class="select-pattern-box" />
        <input v-model="selectedTimeUnitType" type="text" class="select-pattern-box" />
      </div>
      <div v-if="selectedOccurrence === 'MaximumDuration'">
        once
        <select v-model="selectedEventP">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        [becomes satisfied] it remains so for less than
        <input v-model="selectedTime" type="number" class="select-pattern-box" />
        <input v-model="selectedTimeUnitType" type="text" class="select-pattern-box" />
      </div>
      <div v-if="selectedOccurrence === 'Recurrence'">
        <select v-model="selectedEventP">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        [holds] repeatedly [every
        <input v-model="selectedTime" type="number" class="select-pattern-box" />
        <input v-model="selectedTimeUnitType" type="text" class="select-pattern-box" />
        ]
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
        [holds] at most
        <input v-model="selectedInterval" type="number" class="select-pattern-box" />
        times.
      </div>
      <div v-if="selectedOccurrence === 'TransientState'">
        <select v-model="selectedEventP">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        [holds] after
        <input v-model="selectedTime" type="number" class="select-pattern-box" />
        <input v-model="selectedTimeUnitType" type="text" class="select-pattern-box" />
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
        [eventually holds]. <br>
        <label class="title">Constraint Event:</label>
        <select v-model="selectedConstraintEvent">
          <option value="Constraint">Constraint</option>
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
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
        [eventually holds] <br>
        <label class="title">Constraint Event:</label>
        <select v-model="selectedConstraintEvent">
          <option value="Constraint">Constraint</option>
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select> <br>

        <div v-for="(chainedEvent, index) in selectedChainedEvents" :key="index">
          <label class="title">followed by ({{ index + 1 }}):</label>
          <!-- Select for Chained Event -->
          <select v-model="chainedEvent.event.name">
            <option v-for="event in events" :key="event">{{ event }}</option>
          </select>
          <!-- Time input for Chained Event -->
          <input v-model="chainedEvent.time_bound.type" type="text" class="select-pattern-box" placeholder="Type" />
          <input v-model="chainedEvent.time_bound.upper_limit" type="number" class="select-pattern-box" placeholder="Upper Limit" />
          <input v-model="chainedEvent.time_bound.time_unit" type="text" class="select-pattern-box" placeholder="Time Unit" />
          <!-- Constraint Event for Chained Event -->
          <select v-model="chainedEvent.constrain_event.name">
            <option value="Constraint">Constraint</option>
            <option v-for="event in events" :key="event">{{ event }}</option>
          </select>
        </div>
        <button class="button" @click="addChainedEvent">Add Chained Event</button>

      </div>
      <div v-if="selectedOrder=== 'ResponseChainN1'">
        if
        <select v-model="selectedEventP">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        //TODO <br>
        <label class="title">Constraint Event:</label>
        <select v-model="selectedConstraintEvent">
          <option value="Constraint">Constraint</option>
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
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
    </div>

    <div v-if="selectedOrder=== 'Response' " class="selection-group">
      <label class="title">Constraint Event:</label><br>
      <select v-model="selectedConstraintEvent">
        <option value="Constraint">Constraint</option>
        <option v-for="event in events" :key="event">{{ event }}</option>
      </select>
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
      <pre v-if="mapping" style="white-space: pre-wrap;">{{ mapping }}</pre>
      <button @click="copyToClipboard" v-if="mapping" class="copy-button">Copy to Clipboard</button>
      <div class="copy-feedback" v-if="showCopyFeedback">{{ "Copied to Clipboard!" }}</div>
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
  //display: none;
  animation: fadeOut 2s forwards;
}

@keyframes fadeOut {
  0% { opacity: 1; }
  100% { opacity: 0; display: none; }
}

</style>