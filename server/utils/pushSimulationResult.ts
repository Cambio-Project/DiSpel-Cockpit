import {Result} from "~/server/models/result.model";

export async function pushSimulationResult(simulationID: string, simulationNames: string[], simulationResults: boolean[][]) {
    try {
        var result = await Result.findOne({simulationID: simulationID});

        if (!result) {
            result = await Result.create({
                simulationID: simulationID
            });
        }

        result.simulationNames = simulationNames
        // @ts-ignore
        result.simulationResults = simulationResults

        // Update results total
        result.simulationResultsTotal = simulationResults.length

        var responsesCount = 0
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
            if(verificationRunSuccess){
                scenarioSuccessCounter++
            }
            verificationRunIndex++
        }
        result.simulationResultsScenarioSuccesses = scenarioSuccesses
        result.simulationResultsScenarioSuccessesTotal = scenarioSuccessCounter

        // compute resilience score
        var resilienceScore = 0
        var testSum = 0
        var testSuccesses = 0
        if (result.searchResultsTotal !== undefined && result.searchResultsTotal !== null  && result.searchResultsScenarioSuccessesTotal != undefined) {
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

