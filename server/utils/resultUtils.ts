import {Result} from "~/server/models/result.model";

export async function getOrCreateResults(simulationID: string) {
    let result = await Result.findOne({simulationID: simulationID});
    if (!result) {
        result = await Result.create({
            simulationID: simulationID,
            simulationUpdateRequired: true,
            searchUpdateRequired: true,
        });
    }
    return result
}

export function updateResilienceScore(result: any) {
    let resilienceScore = 0;
    let testSum = 0;
    let testSuccesses = 0;
    if (result.searchResultsTotal !== undefined && result.searchResultsTotal !== null && result.searchResultsScenarioSuccessesTotal != undefined) {
        testSum += result.searchResultsTotal
        testSuccesses += result.searchResultsScenarioSuccessesTotal
    }
    if (result.simulationResultsTotal !== undefined && result.simulationResultsTotal !== null && result.simulationResultsScenarioSuccessesTotal != undefined) {
        testSum += result.simulationResultsTotal
        testSuccesses += result.simulationResultsScenarioSuccessesTotal
    }
    if (testSum > 0) {
        resilienceScore = Math.floor(100 * testSuccesses / testSum)
    }
    result.resilienceScore = resilienceScore
}

