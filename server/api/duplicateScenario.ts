import crypto from "crypto";
import {Scenario} from "~/server/models/scenario.model";

export default defineEventHandler(async (event) => {
    let body = await readBody(event);
    body = JSON.parse(body)

    if (typeof body.simulationID === "undefined") {
        return {
            "success": false,
            "Scenario": null
        }
    }

    try {
        // Get original scenario
        const simulationID = body.simulationID
        const scenarioToDuplicate = await Scenario.findOne({simulationID: simulationID})
        console.log("The original object")
        console.log(scenarioToDuplicate)

        // copy scenario
        const duplicatedScenario = scenarioToDuplicate!.toObject()
        console.log("The cloned object")
        console.log(duplicatedScenario)
        //@ts-ignore
        delete duplicatedScenario._id
        //@ts-ignore
        delete duplicatedScenario._v

        duplicatedScenario.simulationID = crypto.randomUUID();
        duplicatedScenario.name = duplicatedScenario.name + " Copy"

        const result = new Scenario(duplicatedScenario)
        await result.save();

        return {
            "success": true,
            "Scenario": result
        };
    } catch (e) {
        return {
            "success": false,
            "Scenario": null
        };
    }
});