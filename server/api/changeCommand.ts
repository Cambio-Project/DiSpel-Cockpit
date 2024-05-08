import {Command} from "~/server/models/command.model";

export default defineEventHandler(async (event) => {
    // read the request body
    const body = await readBody(event);
    const requestBody = JSON.parse(body);

    try {
        // extract the ID of the item to be updated
        const commandId = requestBody._id;
        // remove _id from the update data
        delete requestBody._id;

        // update the event
        const updatedCommand = await Command.updateOne({_id: commandId}, requestBody);

    } catch (e) {
        console.log("Error updating command:", e);
        return {"done": false};
    }
});