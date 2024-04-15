
export default defineEventHandler(async (event) => {
    let body = await readBody(event)
    body = JSON.parse(body)

    if (typeof body.simulationID === "undefined" || body.fieldName === "undefined" || body.fieldValue === "undefined") {
        return {
            "success": false,
        }
    }

    const simulationID = body.simulationID
    const fullFieldName = body.fieldName
    const fieldValue = body.fieldValue

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

        // check if the field exists and if it's an array
        // @ts-ignore
        if (Array.isArray(field)) {
            // append the new value to the array
            field.push(fieldValue);
        } else {
            // if the field is not an array, update it directly
            // @ts-ignore
            scenario[fullFieldName] = fieldValue;
        }

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

