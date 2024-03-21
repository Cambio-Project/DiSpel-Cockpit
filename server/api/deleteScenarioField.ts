export default defineEventHandler(async (event) => {
    // Read the request body
    var body = await readBody(event)
    body = JSON.parse(body)

    if (typeof body.simulationID === "undefined" || body.fieldName === "undefined" || body.fieldIndex === "undefined") {
        return {
            "success": false,
             "message": "simulationID, fieldName or fielIndex not defined"
         }
     }

    const simulationID = body.simulationID
    const fieldName = body.fieldName
    const fieldIndex = body.fieldIndex

    try {
        const scenario = await Scenario.findOne({ simulationID: simulationID });

        if (!scenario) {
            return {
                success: false,
                message: "Scenario not found",
            };
        }

        // check if the field exists
        // @ts-ignore
        if (fieldName in scenario) {
            // delete the value from the array
            // @ts-ignore
            const responses = scenario[fieldName];
            responses.splice(fieldIndex, 1)
        } else {
            return {
                "success": false,
                "message": "Error finding the entry"
            };
        }

        await scenario.save();

    } catch (e) {
        console.log(e)
        return {
            "success": false,
            "message": "Error deleting the entry"
        };
    }

    return {
        "success": true,
    };
});