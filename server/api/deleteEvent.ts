import {Event} from "~/server/models/event.model";

export default defineEventHandler(async (event) => {
    // Read the request body
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