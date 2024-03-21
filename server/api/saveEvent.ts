import {Event} from "~/server/models/event.model";
import * as crypto from "crypto";
import {User} from "~/server/models/user.model";

// endpoint for saving an event to the Event MongoDB table
export default defineEventHandler(async (event) => {

    // read the body
    var body = await readBody(event)
    body = JSON.parse(body)

    // create a random UUID for the event
    body["_id"] = crypto.randomUUID()

    try {
        // create the event entry in the Event MongoDB table
        await Event.create(body)
    } catch (e) {
        console.log("Error creating event")
    }

    return {
        "done": true
    };
});