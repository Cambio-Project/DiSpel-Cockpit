export default defineEventHandler(async (event) => {
    let body = await readBody(event);
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
        const updatedScenario = await Scenario.updateOne({simulationID: simulationID}, {
            [fieldName]: fieldValue
        });

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

    return {
        "success": true,
    };
})