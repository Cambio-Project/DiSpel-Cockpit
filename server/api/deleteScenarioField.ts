export default defineEventHandler(async (event) => {
    // Read the request body
    let body = await readBody(event)
    body = JSON.parse(body)

    if (typeof body.simulationID === "undefined" || body.fieldName === "undefined" || body.fieldIndex === "undefined") {
        return {
            "success": false,
            "message": "simulationID, fieldName or fieldIndex not defined"
        }
    }

    const simulationID = body.simulationID
    const fullFieldName = body.fieldName
    const fieldIndex = body.fieldIndex

    try {
        const scenario = await Scenario.findOne({simulationID: simulationID});

        if (!scenario) {
            return {
                success: false,
                message: "Scenario not found",
            };
        }

        // Handle nested elements
        let field = scenario;
        const allFieldNames = fullFieldName.split(".");
        for (const partFieldName of allFieldNames) {
            if (partFieldName in field) {
                // @ts-ignore
                field = field[partFieldName];
            } else {
                return {
                    success: false,
                    message: "Field not found",
                };
            }
        }

        // delete the value from the array
        // @ts-ignore
        const responses = field;
        // @ts-ignore
        responses.splice(fieldIndex, 1)

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