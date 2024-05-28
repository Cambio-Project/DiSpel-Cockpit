import {getOrCreateResults} from "~/server/utils/resultUtils";
import {computeSearchMetrics} from "~/server/utils/pushSearchResult";
import {computeSimulationMetrics} from "~/server/utils/pushSimulationResult";

export default defineEventHandler(async (event) => {
    // Read the request body
    const body = await readBody(event);
    const requestBody = JSON.parse(body);
    const simulationID = requestBody.simulationID;
    const index = requestBody.index;

    try {
        const result = await getOrCreateResults(simulationID)
        if (result.simulationResults !== null) {
            for (let runResult of result.simulationResults) {
                // @ts-ignore
                runResult.splice(index, 1)
            }
        }
        if (result.searchResults !== null) {
            for (let runResult of result.searchResults) {
                // @ts-ignore
                runResult.splice(index, 1)
            }
        }
        computeSearchMetrics(result)
        computeSimulationMetrics(result)
        await result.save()
    } catch (e) {
        console.log("Error deleting event:", e);
        return {"done": false};
    }
});