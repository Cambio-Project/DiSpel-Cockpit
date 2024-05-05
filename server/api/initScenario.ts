import crypto from "crypto";

export default defineEventHandler(async (event) => {
    const simulationID = crypto.randomUUID()
    try {
        //await User.create({name:"admin", email:"test@example.com"})
        await Scenario.create({
            simulationID: simulationID,
            category: "None",
            specification: {measurementSources: ["DB_WRITE_1_ResponseTimes", "DB_READ_1_ResponseTimes", "AllResponseTimes", "NL_latency"]}
        });
        console.log("Created Scenario with simulationID: " + simulationID)
    } catch (err) {
        console.log(err)
    }

    return {
        "success": true,
        "simulationID": simulationID
    };
})