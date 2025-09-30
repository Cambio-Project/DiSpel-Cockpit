export default defineEventHandler(async (event) => {
    let body = await readBody(event)
    body = JSON.parse(body)

    if (typeof body.simulationID === "undefined" || typeof body.oldName === "undefined" || typeof body.listener === "undefined") {
        return {
            "success": false,
        }
    }

    const simulationID = body.simulationID
    const listener = body.listener
    delete listener._id
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
        const index = scenario.specification!.listeners.findIndex(item => item.listener_name === oldName);
        if (index < 0) {
            return {
                success: false,
                message: "Listener not found",
            };
        }
        scenario.specification!.listeners[index] = listener;

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

