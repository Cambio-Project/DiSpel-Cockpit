// endpoint for retrieving one scenario from the Scenario MongoDB table by its simulationID
export default defineEventHandler(async (event) => {

    // read body
    var body = await readBody(event)
    body = JSON.parse(body)

    // simulationID is required
    if (typeof body.simulationID === "undefined") {
        return {
            "success": false,
            "Scenario": null
        }
    }

    try {
        const simulationID = body.simulationID
        // get the scenario with the specified simulationID from the Scenario MongoDB table
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