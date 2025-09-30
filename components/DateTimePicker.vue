<template>
  <UInput type="datetime-local" id="datetime" v-model="selectedDateTime" @change="convertToEpoch"
          placeholder="Select Date and Time" style="font-size: 15px;"/>
</template>

<script setup>
import {ref, watch} from 'vue'

// Accept the initial timestamp as a prop
const props = defineProps({
  initialTimestamp: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['update:unixTimestamp'])

const selectedDateTime = ref('')
const unixTimestamp = ref(props.initialTimestamp || null)

const convertToEpoch = () => {
  if (selectedDateTime.value) {
    // Convert the selected datetime string to a Date object
    const date = new Date(selectedDateTime.value)
    // Get the Unix epoch timestamp (milliseconds since Jan 1, 1970)
    unixTimestamp.value = date.getTime() / 1000 // Convert to seconds (Unix epoch timestamp)
  }
}

// Initialize the input field if initial timestamp is provided
watch(() => props.initialTimestamp, (newTimestamp) => {
  if (newTimestamp !== null) {
    unixTimestamp.value = newTimestamp
    // Convert Unix timestamp to local date-time string format
    const offset = (new Date(unixTimestamp.value * 1000)).getTimezoneOffset();
    const localDate = new Date((unixTimestamp.value - offset*60) * 1000 )
    selectedDateTime.value = localDate.toISOString().slice(0, 16)
  }
}, { immediate: true })

// Emit the unixTimestamp whenever it changes
watch(unixTimestamp, (newTimestamp) => {
  if (newTimestamp !== null) {
    // Emitting the timestamp to the parent
    emit('update:unixTimestamp', newTimestamp)
  }
})
</script>
