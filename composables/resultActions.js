export function getSimulationVerificationResultsPerResponse(result, responseIndex) {
    const defaultResult = "0 / 0"
    if (result === undefined) {
        return defaultResult;
    }
    const totals = result.simulationResultsTotal;
    const successes = result.simulationResultsResponseSuccesses;
    if (totals === undefined || successes === undefined) {
        return defaultResult
    }
    return successes[responseIndex] + " / " + totals + computePercentageString(successes[responseIndex], totals)
}

export function getResilienceScore(result) {
    let resilienceScore = 0;
    if (result !== undefined && result.resilienceScore !== undefined) {
        resilienceScore = result.resilienceScore
    }
    return resilienceScore
}

export function getResilienceScoreColor(result) {
    //value from 0 to 1
    const value = 0.1 * this.getResilienceScore(result)
    const hue = ((value) * 12).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
}

export function getSearchVerificationResultsPerResponse(result, responseIndex) {
    const defaultResult = "0 / 0"
    if (result === undefined) {
        return defaultResult;
    }
    const totals = result.searchResultsTotal;
    const successes = result.searchResultsResponseSuccesses;
    if (totals === undefined || successes === undefined) {
        return defaultResult
    }
    return successes[responseIndex] + " / " + totals + computePercentageString(successes[responseIndex], totals)
}

export function getSearchVerificationResultsPerScenario(result) {
    const defaultResult = "0 / 0"
    if (result === undefined) {
        return defaultResult;
    }
    const totals = result.searchResultsTotal;
    const successes = result.searchResultsScenarioSuccessesTotal;
    if (totals === undefined || successes === undefined) {
        return defaultResult
    }
    return successes + " / " + totals + computePercentageString(successes, totals)
}

export function getSimulationVerificationResultsPerScenario(result) {
    const defaultResult = "0 / 0"
    if (result === undefined) {
        return defaultResult;
    }
    const totals = result.simulationResultsTotal;
    const successes = result.simulationResultsScenarioSuccessesTotal;
    if (totals === undefined || successes === undefined) {
        return defaultResult
    }
    return successes + " / " + totals + computePercentageString(successes, totals)
}

function computePercentageString(top, bottom) {
    if (bottom === 0) {
        return ""
    } else {
        const value = Math.round(100 * (top / bottom))
        return " (" + value + "%)"
    }
}

export function mapResultToColor(resultValue) {
    if (resultValue === undefined) {
        return 'gray'
    }
    if (resultValue) {
        return 'green'
    } else {
        return 'red'
    }
}