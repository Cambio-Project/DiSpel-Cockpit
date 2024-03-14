import {Event} from "~/server/models/event.model";

export default defineEventHandler(async (event) => {
    // read the request body
    const body = await readBody(event);
    const requestBody = JSON.parse(body);

    try {
        // extract the ID of the item to be updated
        const eventId = requestBody._id;
        // remove _id from the update data
        delete requestBody._id;

        // update the event
        const updatedEvent = await Event.updateOne({ _id: eventId }, requestBody);

    } catch (e) {
        console.log("Error updating event:", e);
        return { "done": false };
    }
});