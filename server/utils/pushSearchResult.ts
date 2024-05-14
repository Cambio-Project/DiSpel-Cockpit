import {Result} from "~/server/models/result.model";

export async function pushSearchResult(simulationID: string, searchNames: string[], searchResults: boolean[][]) {
    try {
        var result = await Result.findOne({simulationID: simulationID});

        if (!result) {
            result = await Result.create({
                simulationID: simulationID
            });
        }

        // Set values directly
        result.searchNames = searchNames
        // @ts-ignore
        result.searchResults = searchResults

        // Update results total
        result.searchResultsTotal = searchResults.length

        var responsesCount = 0
        if(searchResults.length > 0){
            responsesCount = searchResults[0].length
        }

        // update response successes
        let successNumbers = Array<number>(responsesCount)
        successNumbers.fill(0)
        for (let verificationResult of searchResults) {
            for (let responseIndex = 0; responseIndex < responsesCount; responseIndex++) {
                if (verificationResult[responseIndex]) {
                    successNumbers[responseIndex] = successNumbers[responseIndex] + 1
                }
            }
        }
        result.searchResultsResponseSuccesses = successNumbers

        // update scenario successes
        let scenarioSuccesses = Array<boolean>(searchResults.length)
        let verificationRunIndex = 0
        for (let verificationResult of searchResults) {
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


