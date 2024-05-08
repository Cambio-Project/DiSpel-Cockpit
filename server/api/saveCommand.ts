import {Command} from "~/server/models/command.model";
import * as crypto from "crypto";

export default defineEventHandler(async (event) => {
    let body = await readBody(event)
    body = JSON.parse(body)

    body["_id"] = crypto.randomUUID()

    try {
        await Command.create(body)
    } catch (e) {
        console.log("Error creating command")
    }

    return {
        "done": true
    };
});