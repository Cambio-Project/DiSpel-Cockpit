import {Scenario} from "~/server/models/scenario.model";

export default defineEventHandler(async (event) => {
    // Read the request body
    let body = await readBody(event);
    body = JSON.parse(body)

    if (typeof body.simulationID === "undefined") {
        return {
            "success": false,
            "message": "simulationID not defined"
        }
    }

    const simulationID = body.simulationID

    try {
        await Scenario.deleteOne({simulationID: simulationID});
        await Result.deleteOne({simulationID: simulationID});
    } catch (e) {
        console.log(e)
        return {
            "success": false,
            "message": "Error deleting the entry"
        };
    }

    return {
        "success": true,
    };
});