<script setup lang="ts">
import Scenarios from "../components/Scenarios.vue";
import Navbar from "~/components/Navbar.vue";
</script>

<template>
  <client-only>
    <Navbar title="Scenario Overview"></Navbar>
    <Scenarios></Scenarios>
  </client-only>
</template>
