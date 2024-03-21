<script setup lang="ts">

//Setup (Check Connection)
const serviceStatus = {
  db: "red",
  pspWizard: "red",
  tqPropRefiner: "red",
  tbVerifier: "red",
  miSim: "red",
}

// update the service states of the tools
async function updateServiceState(){
  const res = await useFetch("/api/dbPing")
  const body = res.data.value

  for (const bodyElement in body) {
    // @ts-ignore
    serviceStatus[bodyElement] = body[bodyElement].status
  }
}

await updateServiceState()

</script>

<template>
  <h1 class="text-3xl">Dashboard Landing Page</h1>

  <UContainer class="flex flex-col items-center space-y-5">
    <UDivider class="mt-2" label="" />
    <div>
      <h1 class="text-2xl">Service Status Information
        <UTooltip text="">
          <template #text>
            <span> Shows if the Service is available </span>
          </template>
          <Icon name="i-material-symbols-info-outline-rounded" class="text-lg"></Icon>
        </UTooltip>
      </h1>
      <div class="flex flex-row space-x-2 mt-2">
        <UChip :color="serviceStatus.db" size="lg"><UBadge color="white" class="text-sm	">Database</UBadge></UChip>
        <UChip :color="serviceStatus.pspWizard" size="lg"><UBadge color="white" class="text-sm	">PSPWizard</UBadge></UChip>
        <UChip :color="serviceStatus.miSim" size="lg"><UBadge color="white" class="text-sm	">MiSim</UBadge></UChip>
        <UChip :color="serviceStatus.tbVerifier" size="lg"><UBadge color="white" class="text-sm	">TBVerifier</UBadge></UChip>
        <UChip :color="serviceStatus.tqPropRefiner" size="lg"><UBadge color="white" class="text-sm	">TQPropRefiner</UBadge></UChip>
      </div>
    </div>
    <UDivider label="" />
    <div>
      <h1 class="text-2xl">Manage Scenarios</h1>
      <NuxtLink to="/scenariosSite">
        <UButton class="w-fit text-center mt-2">Go to Scenario overview <UIcon name="i-material-symbols-arrow-forward-rounded" dynamic></UIcon></UButton>
      </NuxtLink>
    </div>
  </UContainer>

</template>