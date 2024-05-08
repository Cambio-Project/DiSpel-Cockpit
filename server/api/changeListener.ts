import {Listener} from "~/server/models/listener.model";

export default defineEventHandler(async (event) => {
    // read the request body
    const body = await readBody(event);
    const requestBody = JSON.parse(body);

    try {
        // extract the ID of the item to be updated
        const listenerId = requestBody._id;
        // remove _id from the update data
        delete requestBody._id;

        // update the event
        const updatedListener = await Listener.updateOne({_id: listenerId}, requestBody);

    } catch (e) {
        console.log("Error updating listener:", e);
        return {"done": false};
    }
});