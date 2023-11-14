
<template>
  <img alt="Dashboard logo" src="./assets/logo-dash.jpeg">
  <DashBoard msg="Welcome to Your Dashboard"/>
</template>

<script>
import Dashboard from "@/components/Scenarios.vue"; // change the .vue file that is displayed here

export default {
  name: 'App',
  components: {
    DashBoard: Dashboard
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>


