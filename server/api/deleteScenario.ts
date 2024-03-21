import {Scenario} from "~/server/models/scenario.model";

// endpoint for deleting a scenario in the Scenario MongoDB table
// ID is required
export default defineEventHandler(async (event) => {
    // read the request body
    var body = await readBody(event)
    body = JSON.parse(body)

    // scenario ID is required
    if (typeof body.ID === "undefined") {
        return {
            "success": false,
             "message": "ID not defined"
         }
     }

    const ID = body.ID

    try {
        // delete the value from the array
        // @ts-ignore
        await Scenario.deleteOne({ _id: ID });

        //await scenario.save();

    } catch (e) {
        console.log(e)
        return {
            "success": false,
            "message": "Error deleting the entry"
        };
    }

    return {
        "success": true,
    };
});