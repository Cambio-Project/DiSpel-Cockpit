export default defineEventHandler(async (event) => {
    setResponseHeaders(event, {
        "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "Access-Control-Allow-Origin": "*",
        'Access-Control-Allow-Credentials': 'true',
        "Access-Control-Allow-Headers": '*',
        "Access-Control-Expose-Headers": '*'
    });
    if (event.method === 'OPTIONS') {
        event.node.res.statusCode = 204
        event.node.res.statusMessage = "No Content."
        return 'OK'
    }

    var body = await readBody(event)

    const simId = body.sim_id;
    const responseIndex = body.response_index
    const predicates = body.predicates

    try {
        const scenario = await Scenario.findOne({simulationID: simId});

        if (!scenario) {
            return {
                success: false,
                message: "Scenario not found",
            };
        }

        const responses = scenario.responses;
        responses[responseIndex].predicates_info = predicates;

        await Scenario.updateOne({simulationID: simId}, {
            responses: responses,
        });

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