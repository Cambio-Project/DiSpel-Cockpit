export function toScenarioEditor(simulationID, router = this.$router) {
    router.push(getScenarioEditorURL(simulationID));
}

export function getScenarioEditorURL(simulationID) {
    return '/scenarioEditorSite?simID=' + simulationID
}

export function toPSPWizardResponse(simulationID, router = this.$router) {
    router.push(getPSPWizardResponseURL(simulationID));
}

export function getPSPWizardResponseURL(simulationID) {
    return '/pspwizardSite?simID=' + simulationID + '&type=response'
}

export function toPSPWizardStimulus(simulationID, router = this.$router) {
    router.push(getPSPWizardStimulusURL(simulationID));
}

export function getPSPWizardStimulusURL(simulationID) {
    return '/pspwizardSite?simID=' + simulationID + '&type=stimulus'
}

export function toScenariosOverview(router = this.$router) {
    router.push(getScenariosOverviewURL());
}

export function getScenariosOverviewURL() {
    return '/scenariosSite'
}

export function toStatus(router = this.$router) {
    router.push(getStatusURL());
}

export function getStatusURL() {
    return '/'
}

export function toRefinement(simID, responseIndex, file, isSimulation, router = this.$router) {
    router.push(getRefinementURL(simID, responseIndex, file, isSimulation));
}

export function getRefinementURL(simID, responseIndex, file, isSimulation) {
    return '/tqPropRefinerSiteDynamic?sim_id=' + simID + '&response_index=' + responseIndex + '&file=' + file + '&isSimulation=' + isSimulation
}

export async function toScenarioDetails(simulationID, router = this.$router) {
    router.push(getScenarioDetailsURL(simulationID));
}

export function getScenarioDetailsURL(simulationID) {
    return '/scenarioDetails/?simID=' + simulationID
}