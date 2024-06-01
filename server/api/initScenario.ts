import crypto from "crypto";

export default defineEventHandler(async (event) => {
    const simulationID = crypto.randomUUID()
    try {
        //await User.create({name:"admin", email:"test@example.com"})
        await Scenario.create({
            simulationID: simulationID,
            executionID: "0",
            category: "None",
            specification: {measurementSources: ["DB_WRITE_1_ResponseTimes", "DB_READ_1_ResponseTimes", "AllResponseTimes", "NL_latency"]}
        });
    } catch (err) {
        console.log(err)
    }

    return {
        "success": true,
        "simulationID": simulationID
    };
})