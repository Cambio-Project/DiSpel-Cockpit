import {setSearchUpdateRequired} from "~/server/utils/pushSearchResult";
import {setSimulationUpdateRequired} from "~/server/utils/pushSimulationResult";

export default defineEventHandler(async (event) => {
    let body = await readBody(event)
    body = JSON.parse(body)

    if (typeof body.simulationID === "undefined" || body.type === "undefined" || body.editId === "undefined" || body.fieldValue === "undefined") {
        return {
            success: false,
            message: "Input undefined"
        }
    }

    const simulationID = body.simulationID
    const type = body.type
    const editId = body.editId
    const fieldValue = body.fieldValue

    if (type !== "responses" && type !== "stimuli") {
        return {
            success: false,
            message: "Type unknown: " + type
        }
    }

    try {
        const scenario = await Scenario.findOne({simulationID: simulationID});

        if (!scenario) {
            return {
                success: false,
                message: "Scenario not found",
            };
        }

        // @ts-ignore
        scenario[type][editId] = fieldValue

        if (type === "responses") {
            await setSearchUpdateRequired(simulationID)
            await setSimulationUpdateRequired(simulationID)
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

