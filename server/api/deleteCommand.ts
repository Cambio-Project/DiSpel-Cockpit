import {Command} from "~/server/models/command.model";

export default defineEventHandler(async (event) => {
    // Read the request body
    const body = await readBody(event);
    const requestBody = JSON.parse(body);

    try {
        // extract the ID of the item to be deleted
        const commandId = requestBody._id;

        // find and delete the event by its ID
        await Command.deleteOne({ _id: commandId });

    } catch (e) {
        console.log("Error deleting command:", e);
        return { "done": false };
    }
});