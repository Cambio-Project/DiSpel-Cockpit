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
            verificationRunIndex++
        }
        result.searchResultsScenarioSuccesses = scenarioSuccesses
        result.searchResultsScenarioSuccessesTotal = scenarioSuccesses.length

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

