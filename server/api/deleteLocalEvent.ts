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

    try {
        const scenario = await Scenario.findOne({simulationID: simulationID});

        if (!scenario) {
            return {
                success: false,
                message: "Scenario not found",
            };
        }

        // @ts-ignore
        scenario.specification!.events = scenario.specification!.events.filter(item => item.predicate_name !== event1.predicate_name)

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

