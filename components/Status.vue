<script>
export default {
  methods: {
    updateServiceState,
    async silentLocalUpdateServiceState(){
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
        prometheusService: "red",
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
  <UContainer class="flex flex-col items-center space-y-5">
    <UDivider class="mt-2" label=""/>
    <div>
      <h1 class="text-2xl">Dependencies Status Information
        <UTooltip text="">
          <template #text>
            <span> Shows whether required dependencies are available</span>
          </template>
          <Icon name="i-material-symbols-info-outline-rounded" class="text-lg"></Icon>
        </UTooltip>
        <UTooltip text="Update Tool Status">
        <UButton class="ml-2" icon="i-heroicons-arrow-path-solid" square size="xs"
                 @click="localUpdateServiceState()"></UButton>
        </UTooltip>
      </h1>
      <div class="flex flex-row space-x-2 mt-2">
        <UTooltip text="For detailed investigation of scenario results.">
          <UChip :color="serviceStatus.prometheusService" size="lg">
            <UBadge color="white" class="text-sm	">Prometheus</UBadge>
          </UChip>
        </UTooltip>

        <UTooltip text="Stores scenarios and analysis results">
          <UChip :color="serviceStatus.db" size="lg">
            <UBadge color="white" class="text-sm	">Database</UBadge>
          </UChip>
        </UTooltip>

        <UTooltip text="Translates PSP specifications">
          <UChip :color="serviceStatus.pspWizard" size="lg">
            <UBadge color="white" class="text-sm	">PSPWizard</UBadge>
          </UChip>
        </UTooltip>

        <UTooltip text="Performs simulations to generate scenario occurrences">
          <UChip :color="serviceStatus.miSim" size="lg">
            <UBadge color="white" class="text-sm	">MiSim</UBadge>
          </UChip>
        </UTooltip>

        <UTooltip text="Performs searches in monitoring data to find scenario occurrences">
          <UChip :color="serviceStatus.moSim" size="lg">
            <UBadge color="white" class="text-sm	">MoSIM</UBadge>
          </UChip>
        </UTooltip>

        <UTooltip text="Verifies scenario occurrences against the scenario specification">
          <UChip :color="serviceStatus.tbVerifier" size="lg">
            <UBadge color="white" class="text-sm	">TBVerifier</UBadge>
          </UChip>
        </UTooltip>

        <UTooltip text="Refines PSP specifications">
          <UChip :color="serviceStatus.tqPropRefiner" size="lg">
            <UBadge color="white" class="text-sm	">TQPropRefiner</UBadge>
          </UChip>
        </UTooltip>

      </div>
    </div>
    <UDivider label=""/>
    <div>
      <NuxtLink to="/scenariosSite">
        <UButton size="xl" :color="overallStatus" icon="i-heroicons-rocket-launch-solid"
                 class="w-fit text-center mt-2">
          Start Working!
          <UIcon name="i-material-symbols-arrow-forward-rounded" dynamic></UIcon>
        </UButton>
      </NuxtLink>

      <div v-if="overallStatus === 'yellow'" class="mt-4">
        <div class="message-box p-2">
          <UButton icon="i-heroicons-exclamation-triangle-solid" size="xl" variant="link" :color="overallStatus"
                   class="">
          </UButton>
          <div><strong>Warning!</strong></div>
          <div>Some features of DiSpel might not work as intended while some dependencies are unavailable!</div>
        </div>
      </div>

      <div v-if="overallStatus === 'red'" class="mt-4">
        <div class="message-box p-2">
          <UButton icon="i-heroicons-exclamation-triangle-solid" size="xl" variant="link" :color="overallStatus"
                   class="">
          </UButton>
          <div><strong>Error!</strong></div>
          <div>DiSpel will not work properly with all dependencies being unavailable!</div>
        </div>
      </div>

    </div>
  </UContainer>

</template>
