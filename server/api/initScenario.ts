import crypto from "crypto";

// endpoint for initializing a scenario in the Scenario MongoDB table
// creates an empty scenario in the database table
export default defineEventHandler(async (event) => {
    // create a random UUID as the simulation ID
    const simulationID = crypto.randomUUID()
    try {
        // create an empty scenario in the Scenario MongoDB table
        await Scenario.create({simulationID: simulationID, category: "None"});
        console.log("Created Scenario with simulationID: "+simulationID)
    } catch (err) {
        console.log(err)
    }

    return {
        "success": true,
        "simulationID": simulationID
    };
})