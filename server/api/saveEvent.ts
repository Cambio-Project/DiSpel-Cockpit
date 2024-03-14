import {Event} from "~/server/models/event.model";
import * as crypto from "crypto";
import {User} from "~/server/models/user.model";

export default defineEventHandler(async (event) => {

    var body = await readBody(event)
    body = JSON.parse(body)

    body["_id"] = crypto.randomUUID()

    try {
        await Event.create(body)
    } catch (e) {
        console.log("Error creating event")
    }

    return {
        "done": true
    };
});