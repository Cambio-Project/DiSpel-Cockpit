import crypto from "crypto";
import {Event} from "~/server/models/event.model";

// endpoint for setting a specified scenario field in the Scenario MongoDB table
// requires simulationID, fieldName (to set) and fieldValue (to set to)
export default defineEventHandler(async (event) => {
    var body = await readBody(event)
    body = JSON.parse(body)

    // all inputs are required
    if (typeof body.simulationID === "undefined" || body.fieldName === "undefined" || body.fieldValue === "undefined") {
        return {
            "success": false,
        }
    }

    const simulationID = body.simulationID
    const fieldName = body.fieldName
    const fieldValue = body.fieldValue

    try {
        // update the scenario in the Scenario MongoDB table
        const updatedScenario = await Scenario.updateOne({simulationID: simulationID}, {
            [fieldName]: fieldValue
        });

        // check if update was successful
        if (!updatedScenario.acknowledged) {
            return {
                "success": false,
            }
        }
    } catch (e) {
        console.log(e)
        return {
            "success": false,
        };
    }

    // return successful
    return {
        "success": true,
    };
})