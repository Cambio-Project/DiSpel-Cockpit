import {Event} from "~/server/models/event.model";

// endpoint for deleting an event from the Event MongoDB table
export default defineEventHandler(async (event) => {
    // read the request body
    const body = await readBody(event);
    const requestBody = JSON.parse(body);

    try {
        // extract the ID of the item to be deleted
        const eventId = requestBody._id;

        // find and delete the event by its ID
        const deletedEvent = await Event.deleteOne({ _id: eventId });

    } catch (e) {
        console.log("Error deleting event:", e);
        return { "done": false };
    }
});