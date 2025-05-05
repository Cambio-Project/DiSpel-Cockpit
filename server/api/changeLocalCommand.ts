import {setSearchUpdateRequired} from "~/server/utils/pushSearchResult";
import {setSimulationUpdateRequired} from "~/server/utils/pushSimulationResult";

export default defineEventHandler(async (event) => {
    let body = await readBody(event)
    body = JSON.parse(body)

    if (typeof body.simulationID === "undefined"  || typeof body.oldName === "undefined" || typeof body.command === "undefined") {
        return {
            "success": false,
        }
    }

    const simulationID = body.simulationID
    const command = body.command
    delete command._id
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
        const index = scenario.specification!.commands.findIndex(item => item.command_name === oldName);
        if (index !== -1) {
            return {
                success: false,
                message: "Event not found",
            };
        }
        if (index !== -1) {
            scenario.specification!.commands[index] = command;
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

