export default defineEventHandler(async (event) => {

    var body = await readBody(event)
    body = JSON.parse(body)

    if (typeof body.simulationID === "undefined") {
        return {
            "success": false,
            "result": null
        }
    }

    try {
        const simulationID = body.simulationID
        const result = await Result.findOne({simulationID: simulationID})

        return {
            "success": true,
            "result": result
        };
    } catch (e) {
        return {
            "success": true,
            "result": null
        };
    }
})