<script>

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  methods: {
    toStatus,
    toScenariosOverview,
    updateServiceState,
    async silentLocalUpdateServiceState() {
      this.serviceStatus = await updateServiceState();
      this.overallStatus = this.serviceStatus['all']
    },
    async localUpdateServiceState() {
      await this.silentLocalUpdateServiceState();
      await successMessage("Status Checked", "All status information got updated")
    }
  },
  data() {
    return {
      serviceStatus: {
        db: "red",
        pspWizard: "red",
        tqPropRefiner: "red",
        tbVerifier: "red",
        miSim: "red",
        moSim: "red",
      },
      overallStatus: "gray"
    }
  },
  setup() {
    onMounted(async () => {
      preparePopups();
    });
  },
  async beforeMount() {
    await this.silentLocalUpdateServiceState()
  },
}
</script>

<template>
  <ul class="navbar mb-2">
    <li class="title float-left ml-4 mt-3 mb-4"><span class="title">DiSpel Cockpit</span></li>
    <li class="title text-3xl mt-2"><span>{{ title }}</span></li>
    <li class="float-right mr-4 ml-1 mt-2">
      <UTooltip text="Configuration">
        <UChip :color="overallStatus" size="lg">
          <UButton @click="toStatus()" variant="solid" icon="i-heroicons-cog-6-tooth-solid"/>
        </UChip>
      </UTooltip>
    </li>
    <li class="float-right mr-1 ml-6 mt-2">
      <UTooltip text="Overview">
        <UButton @click="toScenariosOverview()" variant="solid" icon="i-heroicons-home-solid"/>
      </UTooltip>
    </li>
  </ul>
  <br/><br/><br/>
</template>

<style>
ul.navbar {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #333;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

ul.navbar .ring-1 {
  --tw-ring-opacity: 0;
}

ul.navbar li a {
  display: block;
  color: black;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

ul.navbar li.title {
  color: white;
  display: inline-block;
}

ul.navbar li a:hover {
  background-color: blue;
}
</style>