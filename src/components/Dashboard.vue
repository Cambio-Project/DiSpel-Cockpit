<template>
  <img alt="Dashboard logo" src="@/assets/logo-dash.jpeg">
  <div class="hello">
    <h1>Welcome to Your Dashboard</h1>
    <p>
      This is our Dashboard
    </p>
    <h3>System</h3>
    <ul>
      <li>link</li>
      <li>link</li>
    </ul>
    <h3>Essential Links</h3>
    <ul>
      <li>link</li>
      <li>link</li>
    </ul>
    <h3>Ecosystem</h3>
    <ul>
      <li>link</li>
      <li>link</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'DashBoard',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>