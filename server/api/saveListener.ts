import {Listener} from "~/server/models/listener.model";
import * as crypto from "crypto";

export default defineEventHandler(async (event) => {
    let body = await readBody(event);
    body = JSON.parse(body)

    body["_id"] = crypto.randomUUID()

    try {
        await Listener.create(body)
    } catch (e) {
        console.log("Error creating listener")
    }

    return {
        "done": true
    };
});