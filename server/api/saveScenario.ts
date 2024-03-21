import {Scenario} from "~/server/models/scenario.model";
import * as crypto from "crypto";
import {User} from "~/server/models/user.model";

// endpoint for saving scenarios to the Scenario MongoDB table
// requires all scenario fields in the body
export default defineEventHandler(async (event) => {

    // read the body
    var body = await readBody(event)
    body = JSON.parse(body)

    // create a random UUID for the simulation
    body["simulationID"] = crypto.randomUUID()

    try {
        // create the scenario entry in the Scenario MongoDB table
        await Scenario.create(body)
    } catch (e) {
        console.log("Error creating scenario")
    }

    return {
        "done": true
    };
});