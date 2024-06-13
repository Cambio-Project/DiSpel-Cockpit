<script setup lang="ts">
import Scenario from "../components/Scenario.vue";
import Navbar from "~/components/Navbar.vue";
</script>

<template>
  <client-only>
    <Navbar title="Scenario Details"></Navbar>
    <Scenario></Scenario>
  </client-only>
</template>
