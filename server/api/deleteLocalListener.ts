export default defineEventHandler(async (event) => {
    let body = await readBody(event)
    body = JSON.parse(body)

    if (typeof body.simulationID === "undefined" || typeof body.listener === "undefined") {
        return {
            "success": false,
        }
    }

    const simulationID = body.simulationID
    const listener = body.listener

    try {
        const scenario = await Scenario.findOne({simulationID: simulationID});

        if (!scenario) {
            return {
                success: false,
                message: "Scenario not found",
            };
        }

        // @ts-ignore
        scenario.specification!.listeners = scenario.specification!.listeners.filter(item => item.listener_name !== listener.listener_name)

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

