import {Scenario} from "~/server/models/scenario.model";
import * as crypto from "crypto";

export default defineEventHandler(async (event) => {
    let body = await readBody(event);
    body = JSON.parse(body)
    body["simulationID"] = crypto.randomUUID()

    try {
        await Scenario.create(body)
    } catch (e) {
        console.log("Error creating scenario")
    }

    return {
        "done": true
    };
});