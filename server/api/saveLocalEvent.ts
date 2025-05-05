import {setSearchUpdateRequired} from "~/server/utils/pushSearchResult";
import {setSimulationUpdateRequired} from "~/server/utils/pushSimulationResult";

export default defineEventHandler(async (event) => {
    let body = await readBody(event)
    body = JSON.parse(body)

    if (typeof body.simulationID === "undefined" || typeof body.event === "undefined") {
        return {
            "success": false,
        }
    }

    const simulationID = body.simulationID
    const event1 = body.event
    delete event1._id

    try {
        const scenario = await Scenario.findOne({simulationID: simulationID});

        if (!scenario) {
            return {
                success: false,
                message: "Scenario not found",
            };
        }

        scenario.specification!.events.push(event1)

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

