import {getOrCreateResults, updateResilienceScore} from "~/server/utils/resultUtils";

export function computeSimulationMetrics(result: any) {
    const simulationResults = result.simulationResults

    // Update results total
    result.simulationResultsTotal = simulationResults.length

    let responsesCount = 0;
    if (simulationResults.length > 0) {
        responsesCount = simulationResults[0].length
    }

    // update response successes
    let successNumbers = Array<number>(responsesCount)
    successNumbers.fill(0)
    for (let verificationResult of simulationResults) {
        for (let responseIndex = 0; responseIndex < responsesCount; responseIndex++) {
            if (verificationResult[responseIndex]) {
                successNumbers[responseIndex] = successNumbers[responseIndex] + 1
            }
        }
    }
    result.simulationResultsResponseSuccesses = successNumbers

    // update scenario successes
    let scenarioSuccesses = Array<boolean>(simulationResults.length)
    let scenarioSuccessCounter = 0
    let verificationRunIndex = 0
    for (let verificationResult of simulationResults) {
        let verificationRunSuccess = true
        for (let verificationResponseResult of verificationResult) {
            if (!verificationResponseResult) {
                verificationRunSuccess = false
                break
            }
        }
        scenarioSuccesses[verificationRunIndex] = verificationRunSuccess
        if (verificationRunSuccess) {
            scenarioSuccessCounter++
        }
        verificationRunIndex++
    }
    result.simulationResultsScenarioSuccesses = scenarioSuccesses
    result.simulationResultsScenarioSuccessesTotal = scenarioSuccessCounter

    updateResilienceScore(result)
}

export function setSimulationResults(result: any, simulationNames: string[], simulationResults: boolean[][]) {
    result.simulationNames = simulationNames
    result.simulationResults = simulationResults
}

export async function pushSimulationResult(simulationID: string, simulationNames: string[], simulationResults: boolean[][]) {
    try {
        const result = await getOrCreateResults(simulationID);
        setSimulationResults(result, simulationNames, simulationResults)
        computeSimulationMetrics(result)
        result.simulationUpdateRequired = false
        await result.save();
    } catch (e) {
        console.log(e)
        return {
            "success": false,
            "message": "Error updating the entry"
        };
    }

    return {
        "success": true,
    };
}

export async function pushSimulationNames(simulationID: string, simulationNames: string[]) {
    try {
        const result = await getOrCreateResults(simulationID)
        result.simulationNames = simulationNames
        result.simulationUpdateRequired = true
        await result.save();
    } catch (e) {
        console.log(e)
        return {
            "success": false,
            "message": "Error updating the entry"
        };
    }

    return {
        "success": true,
    };
}

export async function setSimulationUpdateRequired(simulationID: string) {
    try {
        const result = await getOrCreateResults(simulationID)
        result.simulationUpdateRequired = true
        await result.save();
    } catch (e) {
        console.log(e)
        return {
            "success": false,
            "message": "Error setting search update required flag"
        };
    }
}
