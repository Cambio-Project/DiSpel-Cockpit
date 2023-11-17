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

    <div class="message-container">
      <p>Preview:</p>
      <div v-if="selectedOccurrence === 'Universality'">
        It is always the case that
        <select v-model="selectedEvent">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        holds.
      </div>
      <div v-if="selectedOccurrence === 'Absence'">
        It is never the case that
        <select v-model="selectedEvent">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        holds.
      </div>
      <div v-if="selectedOrder=== 'Response'">
        If
        <select v-model="selectedEvent">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        [has occurred] then in response
        <select v-model="selectedEvent">
          <option v-for="event in events" :key="event">{{ event }}</option>
        </select>
        [eventually holds].
      </div>
    </div>

    <div class="selected-options">
      <label class="title">Selected Options:</label>
      <div>{{ selectedScope }}, {{ selectionType === 'Occurrence' ? selectedOccurrence : selectedOrder }}</div>
    </div>

    <div>
      <button class="commit-button" @click="test">Transform to Temporal Logic</button>
    </div>

    <br>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scopes: ["Globally", "Before R", "After Q", "Between Q and R", "After Q until R"],
      selectionType: null,
      occurrenceOptions: ["Steady State", "Minimum Duration", "Maximum Duration", "Recurrence", "Universality", "Absence", "Existence", "Bounded Existence", "Transient State"],
      orderOptions: ["Response", "Response Chain 1N", "Response Chain N1", "Response Invariance", "Precedence", "Precedence Chain 1N", "Precedence Chain N1", "Until"],
      events: ["EventA", "EventB", "EventC"],
      selectedScope: null,
      selectedOccurrence: null,
      selectedOrder: null,
      selectedEvent: null,
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
  },
};
</script>

<style scoped>
.selection-container {
  max-width: 400px;
  margin: auto;
}

.selection-group {
  margin-bottom: 15px;
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

.commit-button {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 4px;
}

.commit-button:hover {
  background-color: #45a049;
}
</style>