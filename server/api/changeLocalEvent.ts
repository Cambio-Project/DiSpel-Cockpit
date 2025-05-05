import {setSearchUpdateRequired} from "~/server/utils/pushSearchResult";
import {setSimulationUpdateRequired} from "~/server/utils/pushSimulationResult";

export default defineEventHandler(async (event) => {
    let body = await readBody(event)
    body = JSON.parse(body)

    if (typeof body.simulationID === "undefined" || typeof body.oldName === "undefined" || typeof body.listener === "undefined") {
        return {
            "success": false,
        }
    }

    const simulationID = body.simulationID
    const event1 = body.event
    delete event1._id
    const oldName = body.oldName

    try {
        const scenario = await Scenario.findOne({simulationID: simulationID});

        if (!scenario) {
            return {
                success: false,
                message: "Scenario not found",
            };
        }

        // @ts-ignore
        const index = scenario.specification!.events.findIndex(item => item.predicate_name === oldName);
        if (index !== -1) {
            return {
                success: false,
                message: "Event not found",
            };
        }
        if (index !== -1) {
            scenario.specification!.events[index] = event1;
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

