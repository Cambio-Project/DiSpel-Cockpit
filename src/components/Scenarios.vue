<script setup>
import { ref } from 'vue';

const header = ref('Scenarios')
const items = ref([
  { id: 1, label: "#1" },
  { id: 2, label: "#2" },
  { id: 3, label: "#3" }
  ])
</script>


<template>
  <h1>{{ header }}</h1>
  <ul>
      <li v-for="({id, label}) in items" :key="id">
        {{ label }}
      </li>
    </ul>
</template>

<script>
export default {
  name: 'DashBoard',
  props: {
    msg: String
  }
}
</script>