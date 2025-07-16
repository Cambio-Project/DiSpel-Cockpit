import {getOrCreateResults, updateResilienceScore} from "~/server/utils/resultUtils";

export function computeSearchMetrics(result: any) {
    let searchResults = result.searchResults

    // Update results total
    result.searchResultsTotal = searchResults.length

    let responsesCount = 0;
    if (searchResults.length > 0) {
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
    let scenarioSuccessCounter = 0
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
        if (verificationRunSuccess) {
            scenarioSuccessCounter++
        }
        verificationRunIndex++
    }
    result.searchResultsScenarioSuccesses = scenarioSuccesses
    result.searchResultsScenarioSuccessesTotal = scenarioSuccessCounter

    updateResilienceScore(result)
}

export function setSearchResults(result: any, searchNames: string[], searchResults: boolean[][]) {
    // Set values directly
    result.searchNames = searchNames
    // @ts-ignore
    result.searchResults = searchResults
}


export async function pushSearchResult(simulationID: string, searchNames: string[], searchResults: boolean[][]) {
    try {
        const result = await getOrCreateResults(simulationID)
        setSearchResults(result, searchNames, searchResults)
        computeSearchMetrics(result)
        result.searchUpdateRequired = false
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

export async function pushSearchNames(simulationID: string, searchNames: string[]) {
    try {
        // Filter for strings ending with '.csv' (case-insensitive)
        const filteredSearchNames = searchNames.filter(name =>
            name.toLowerCase().endsWith('.csv')
        );

        const result = await getOrCreateResults(simulationID)
        result.searchNames = filteredSearchNames
        result.searchUpdateRequired = true
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

export async function setSearchUpdateRequired(simulationID: string) {
    try {
        const result = await getOrCreateResults(simulationID)
        result.searchUpdateRequired = true
        await result.save();
    } catch (e) {
        console.log(e)
        return {
            "success": false,
            "message": "Error setting search update required flag"
        };
    }
}
