export function toScenarioEditor(simulationID, router = this.$router ) {
    router.push('/scenarioEditorSite?simID=' + simulationID);
}

export function toPSPWizardResponse(simulationID, router = this.$router) {
    router.push('/pspwizardSite?simID=' + simulationID + '&type=response');
}

export function toPSPWizardStimulus(simulationID, router = this.$router) {
    router.push('/pspwizardSite?simID=' + simulationID + '&type=stimulus');
}

export function toScenariosOverview(router = this.$router){
    router.push('/scenariosSite');
}

export function toRefinement(simID, responseIndex, router = this.$router) {
    router.push('/tqPropRefinerSiteDynamic?sim_id=' + simID + '&response_index=' + responseIndex);
}

export async function toScenarioDetails(simulationID, router = this.$router) {
    router.push('/scenarioDetails/?simID=' + simulationID);
}