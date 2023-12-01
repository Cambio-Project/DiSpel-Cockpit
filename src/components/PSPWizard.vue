<script>
//import axios from "core-js/internals/queue";

export default {
  data() {
    return {
      scopes: ["Globally", "Before R", "After Q", "Between Q and R", "After Q until R"],
      selectionType: null,
      occurrenceOptions: ["Steady State", "Minimum Duration", "Maximum Duration", "Recurrence", "Universality", "Absence", "Existence", "Bounded Existence", "Transient State"],
      orderOptions: ["Response", "Response Chain 1N", "Response Chain N1", "Response Invariance", "Precedence", "Precedence Chain 1N", "Precedence Chain N1", "Until"],
      events: ["EventA"],
      customEvent: "",
      targetLogics: ["SEG", "LTL", "MTL", "Prism", "Quantitative Prism", "TBV (untimed)", "TBV (timed)"],
      selectedScope: null,
      selectedOccurrence: null,
      selectedOrder: null,
      selectedEvent1: null,
      selectedEvent2: null,
      selectedEvent3: null,
      selectedEvent4: null,
      selectedTargetLogic: "SEG",
      mapping: null
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
        this.mapping = await response.json();

        // Debug
        console.log(this.mapping);
        console.log('Transformation successful!');
      } catch (error) {
        // Handle any errors that occur during the HTTP request
        console.error('Error transforming to temporal logic:', error);
      }
    },
    async transformToTemporalLogic() {

      const payload = JSON.stringify({
        scope: this.selectedScope,
        pattern: this.selectionType === 'Occurrence' ? this.selectedOccurrence : this.selectedOrder,
        patternProps: {
          event: this.selectedEvent3,
          timeBound: "",
          probabilityBound: ""
        },
        events: [
          {
            name: this.selectedEvent3,
            specification: ""
          }
        ],
        targetLogic: this.selectedTargetLogic,
      })

      console.log(payload)

      await this.sendTransformRequest(payload)
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
          <input type="radio" v-model="selectionType" value="Occurrence" id="occurrence" @change="handleTypeChange" />
          <label for="occurrence">Occurrence</label>
        </div>
        <div class="radio">
          <input type="radio" v-model="selectionType" value="Order" id="order" @change="handleTypeChange" />
          <label for="order">Order</label>
        </div>
      </div>
    </div>

    <div v-if="selectionType === 'Occurrence'" class="selection-group">
      <label class="title">Pattern:</label>
      <select v-model="selectedOccurrence" @change="handleOccurrenceChange" class="select-box">
        <option v-for="occurrence in occurrenceOptions" :key="occurrence">{{ occurrence }}</option>
      </select>
    </div>

    <div v-if="selectionType === 'Order'" class="selection-group">
      <label class="title">Pattern:</label>
      <select v-model="selectedOrder" @change="handleOccurrenceChange" class="select-box">
        <option v-for="order in orderOptions" :key="order">{{ order }}</option>
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
      <div v-if="selectedScope === 'Before R'">
        Before
        <select v-model="selectedEvent1">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
      </div>
      <div v-if="selectedScope === 'After Q'">
        After
        <select v-model="selectedEvent1">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
      </div>
      <div v-if="selectedScope === 'Between Q and R'">
        Between
        <select v-model="selectedEvent1">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        and
        <select v-model="selectedEvent2">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
      </div>
      <div v-if="selectedScope === 'After Q until R'">
        After
        <select v-model="selectedEvent1">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        until
        <select v-model="selectedEvent2">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
      </div>

      <br>

      <div v-if="selectedOccurrence === 'Universality'">
        it is always the case that
        <select v-model="selectedEvent3">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        holds.
      </div>
      <div v-if="selectedOccurrence === 'Absence'">
        It is never the case that
        <select v-model="selectedEvent3">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        holds.
      </div>
      <div v-if="selectedOrder=== 'Response'">
        if
        <select v-model="selectedEvent3">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        [has occurred] then in response
        <select v-model="selectedEvent4">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        [eventually holds].
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
      <pre v-if="mapping">{{ JSON.stringify(mapping, null, 2) }}</pre>
    </div>

    <br>
  </div>
</template>

<style scoped>
.selection-container {
  max-width: 400px;
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