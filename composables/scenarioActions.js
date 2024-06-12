import {successMessage} from "~/composables/popup.js";
import {getScenario, startSearch, startSimulation} from "~/composables/api.js";
import JSZip from "jszip";

export async function startScenarioSimulation(scenario) {
    await successMessage("Simulation started", 'SimID: ' + scenario.simulationID)
    scenario.analysisState = 'simrunning';
    const response = await startSimulation(scenario.simulationID)
    if (response.status) {
        await successMessage("Simulation finished", 'SimID: ' + scenario.simulationID)
        scenario.analysisState = 'simdone';
    } else {
        await failureMessage("Simulation failed", 'SimID: ' + scenario.simulationID + "\n" + response.text)
        scenario.analysisState = 'simfailed';
        console.log(response.text)
    }
}

export async function startScenarioSearch(scenario) {
    await successMessage("Search started", 'SimID: ' + scenario.simulationID)
    scenario.analysisState = 'searchrunning';
    const response = await startSearch(scenario.simulationID);
    if (response.status) {
        await successMessage("Search finished", 'SimID: ' + scenario.simulationID)
        scenario.analysisState = 'searchdone';
    } else {
        await failureMessage("Search failed", 'SimID: ' + scenario.simulationID + "\n" + response.text)
        scenario.analysisState = 'searchfailed';
        console.log(response.text)
    }
}

//Changes all target logics to the same one
export function changeAllTargets(scenarios, target) {
    scenarios.forEach(scenario => {
        scenario.responses.forEach(response => {
            response.target_logic = target;
        })
        scenario.stimuli.forEach(stimulus => {
            stimulus.target_logic = target;
        })
    });
}

//Download a single scenario as json
export async function downloadJSON(simID) {
    const scenario = await getScenario(simID)

    const jsonStr = JSON.stringify(scenario, null, 2);
    const blob = new Blob([jsonStr], {type: 'application/json'})
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    const fileName = 'Scenario_' + scenario.name + '.json';
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

//Download all scenarios as zip file
export async function downloadZip() {
    const zip = new JSZip();
    let c = 1
    this.scenarios.forEach((scenario, index) => {
        const name = c + " - " + scenario.name;
        const jsonData = this.scenarios[index];
        zip.file('Scenario_' + name + '.json', JSON.stringify(jsonData, null, 2));
        c++;
    });

    const content = await zip.generateAsync({type: 'blob'});
    const url = window.URL.createObjectURL(content);

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'Scenarios.zip';
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

export function getScenarioTypeColor(type){
    switch (type){
        case "Exploratory":
            return "purple"
        case "Growth":
            return "blue"
        case "UseCase":
            return "green"
        default:
            return "black"
    }
}

export function getScenarioTypeIcon(type){
    switch (type){
        case "Exploratory":
            return "i-heroicons-light-bulb-solid"
        case "Growth":
            return "i-heroicons-arrow-trending-up-solid"
        case "UseCase":
            return "i-heroicons-user-group-solid"
        default:
            return "i-heroicons-no-symbol-solid"
    }
}