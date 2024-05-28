export async function initScenario() {
    const res = await fetch("/api/initScenario", {
        method: "POST"
    })
    const body = await res.json()
    return body.simulationID;
}

export async function startSimulation(simulationID) {
    await fetch("/api/startSimulation", {
        method: "POST",
        body: JSON.stringify({
            simulationID: simulationID
        })
    })
}

export async function startSearch(simulationID) {
    await fetch("/api/startSearch", {
        method: "POST",
        body: JSON.stringify({
            simulationID: simulationID
        })
    })
}

export async function allScenarios() {
    const response = await fetch("/api/allScenarios");
    const body = await response.json();
    return body.scenarios
}

export async function getResult(simulationID) {
    const response = await fetch("/api/getResult", {
        method: "POST",
        body: JSON.stringify({
            simulationID: simulationID
        })
    });
    const bodyResult = await response.json();
    return bodyResult.result
}

export async function allResults() {
    return await fetch("/api/allResults");
}

export async function deleteScenario(simulationID) {
    await fetch("/api/deleteScenario", {
        method: "POST",
        body: JSON.stringify({
            simulationID: simulationID
        })
    })
}

export async function verifySimulation(scenario) {
    await useFetch("/api/verifySimulation", {
        method: "POST",
        body: JSON.stringify({
            scenario,
        })
    });
}

export async function verifySearch(scenario) {
    await useFetch("/api/verifySearch", {
        method: "POST",
        body: JSON.stringify({
            scenario,
        })
    });
}

export async function getScenario(simulationID) {
    const res = await fetch("/api/getScenario", {
        method: "POST",
        body: JSON.stringify({
            simulationID: simulationID
        })
    })
    const body = await res.json()
    return body.Scenario
}

export async function allEvents() {
    const response = await fetch("/api/allEvents");
    return await response.json();
}

export async function allCommands() {
    const response = await fetch("/api/allCommands");
    return await response.json();
}

export async function allListeners() {
    const response = await fetch("/api/allListeners");
    return await response.json();
}

export async function pushScenarioField(simulationID, field, newValue) {
    await fetch("/api/pushScenarioField", {
        method: "POST",
        body: JSON.stringify({
            simulationID: simulationID,
            fieldName: field,
            fieldValue: newValue
        })
    })
}

export async function setScenarioField(simulationID, field, newValue) {
    await fetch("/api/setScenarioField", {
        method: "POST",
        body: JSON.stringify({
            simulationID: simulationID,
            fieldName: field,
            fieldValue: newValue
        })
    })
}


export async function deleteScenarioField(simulationID, fieldName, fieldIndex) {
    const body = {
        simulationID: simulationID,
        fieldName: fieldName,
        fieldIndex: fieldIndex
    }
    await fetch("/api/deleteScenarioField", {
        method: "POST",
        body: JSON.stringify(body)
    })
}

export async function saveEvent(params) {
    await fetch("/api/saveEvent", {
        method: "POST",
        body: JSON.stringify(params)
    })
}

export async function saveCommand(params) {
    await fetch("/api/saveCommand", {
        method: "POST",
        body: JSON.stringify(params)
    })
}

export async function saveListener(params) {
    await fetch("/api/saveListener", {
        method: "POST",
        body: JSON.stringify(params)
    })
}

export async function changeEvent(params) {
    await fetch("/api/changeEvent", {
        method: "POST",
        body: JSON.stringify(params)
    })
}

export async function changeCommand(params) {
    await fetch("/api/changeCommand", {
        method: "POST",
        body: JSON.stringify(params)
    })
}

export async function changeListener(params) {
    await fetch("/api/changeListener", {
        method: "POST",
        body: JSON.stringify(params)
    })
}

export async function deleteEvent(id) {
    const body = {
        _id: id
    }
    await fetch("/api/deleteEvent", {
        method: "POST",
        body: JSON.stringify(body)
    })
}

export async function deleteCommand(id) {
    const body = {
        _id: id
    }
    await fetch("/api/deleteCommand", {
        method: "POST",
        body: JSON.stringify(body)
    })
}

export async function deleteListener(id) {
    const body = {
        _id: id
    }
    await fetch("/api/deleteListener", {
        method: "POST",
        body: JSON.stringify(body)
    })
}

export async function getPSPMapping(payload) {
    return useFetch("/api/getPSPMapping", {
        method: "POST",
        body: payload
    })
}

export async function deleteResultEntry(simulationID, index) {
    await fetch("/api/deleteResultEntry", {
        method: "POST",
        body: JSON.stringify({
            simulationID: simulationID,
            index: index
        })
    })
}

export async function uploadAdditionalEnvironmentFile(filename, file) {
    const formData = new FormData()
    formData.append(filename, file)
    await fetch("/api/uploadAdditionalEnvironmentFile", {
        method: "POST",
        body: formData
    })
}

