import fs from "fs";

export default defineEventHandler(async (event) => {
    // Read the request body
    const body = await readBody(event);
    const requestBody = JSON.parse(body);

    try {
        const type = requestBody.type;
        const simulationID = requestBody.simulationID;
        const executionID = requestBody.executionID;
        const executionIndex = requestBody.executionIndex;

        const result = await Result.findOne({simulationID: simulationID})
        let resultPath;
        if (type === "simulation") {
            resultPath = "data/simulations_results/" + simulationID + "/" + executionID
            result!.simulationNames.splice(executionIndex, 1);
        } else if (type === "search") {
            resultPath = "data/search_results/" + simulationID + "/" + executionID
            result!.searchNames.splice(executionIndex, 1);
        } else {
            console.error("Invalid result type: " + type)
            return {"done": false};
        }
        fs.rmSync(resultPath, {recursive: true, force: true});
        result!.save()
    } catch (e) {
        console.log("Error deleting result: ", e);
        return {"done": false};
    }
});