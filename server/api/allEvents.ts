import {Event} from "~/server/models/event.model";

// endpoint for retrieving all events from the Event MongoDB table
export default defineEventHandler(async (event) => {

    let events:any = []

    try {
        // get all events from the database
        events = await Event.find({})
    } catch (e) {
        console.log("Error finding events")
    }

    // return the events
    return events
});