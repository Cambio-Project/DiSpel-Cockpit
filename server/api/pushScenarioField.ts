import crypto from "crypto";
import {Event} from "~/server/models/event.model";

export default defineEventHandler(async (event) => {
    var body = await readBody(event)
    body = JSON.parse(body)

    if (typeof body.simulationID === "undefined" || body.fieldName === "undefined" || body.fieldValue === "undefined") {
        return {
            "success": false,
        }
    }

    const simulationID = body.simulationID
    const fieldName = body.fieldName
    const fieldValue = body.fieldValue

    try {
        const scenario = await Scenario.findOne({ simulationID: simulationID });

        if (!scenario) {
            return {
                success: false,
                message: "Scenario not found",
            };
        }

        // check if the field exists and if it's an array
        // @ts-ignore
        if (fieldName in scenario && Array.isArray(scenario[fieldName])) {
            // append the new value to the array
            // @ts-ignore
            scenario[fieldName].push(fieldValue);
        } else {
            // if the field doesn't exist or is not an array, update it directly
            // @ts-ignore
            scenario[fieldName] = fieldValue;
        }

        await scenario.save();

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
})