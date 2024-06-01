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
        let directoryPath;
        let resultCount;
        if (type === "simulation") {
            directoryPath = "data/simulations_results/" + simulationID
            result!.simulationNames.splice(executionIndex, 1);
            resultCount = result!.simulationNames.length;
        } else if (type === "search") {
            directoryPath = "data/search_results/" + simulationID
            result!.searchNames.splice(executionIndex, 1);
            resultCount = result!.searchNames.length;
        } else {
            console.error("Invalid result type: " + type)
            return {"done": false};
        }
        const resultPath = directoryPath + "/" + executionID
        fs.rmSync(resultPath, {recursive: true, force: true});
        await result!.save()
        // Delete whole directory if no results are left
        if (resultCount === 0) {
            fs.rmSync(directoryPath, {recursive: true, force: true});
        }
    } catch (e) {
        console.log("Error deleting result: ", e);
        return {"done": false};
    }
    return {"done": true};
});