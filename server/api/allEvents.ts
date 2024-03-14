import {Event} from "~/server/models/event.model";
import * as crypto from "crypto";

export default defineEventHandler(async (event) => {

    let events:any = []

    try {
        events = await Event.find({})
    } catch (e) {
        console.log("Error finding events")
    }

    return events
});