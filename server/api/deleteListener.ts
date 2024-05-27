import {Listener} from "~/server/models/listener.model";

export default defineEventHandler(async (event) => {
    // Read the request body
    const body = await readBody(event);
    const requestBody = JSON.parse(body);

    try {
        // extract the ID of the item to be deleted
        const listenerId = requestBody._id;

        // find and delete the event by its ID
        await Listener.deleteOne({_id: listenerId});

    } catch (e) {
        console.log("Error deleting event:", e);
        return {"done": false};
    }
});