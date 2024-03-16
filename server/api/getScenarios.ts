export default defineEventHandler(async (event) => {

    var body = await readBody(event)
    body = JSON.parse(body)

    if (typeof body.simulationID === "undefined") {
        return {
            "success": false,
            "Scenario": null
        }
    }

    try {
        const simulationID = body.simulationID
        const scenario = await Scenario.findOne({simulationID: simulationID})

        return {
            "success": true,
            "Scenario": scenario
        };
    } catch (e) {
        return {
            "success": true,
            "Scenario": null
        };
    }
})