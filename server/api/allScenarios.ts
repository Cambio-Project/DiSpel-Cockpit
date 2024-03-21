import {Scenario} from "~/server/models/scenario.model";

// endpoint for retrieving all scenarios from the Scenario MongoDB table
export default defineEventHandler(async (event) => {

    let scenarios:any = []

    try {
        // get all scenarios from the database table
        scenarios = await Scenario.find({})
    } catch (e) {
        console.log("Error finding scenarios")
    }

    // return all scenarios
    return {
        scenarios: scenarios
    };
});