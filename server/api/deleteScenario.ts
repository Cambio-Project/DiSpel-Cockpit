import {Scenario} from "~/server/models/scenario.model";
export default defineEventHandler(async (event) => {
    // Read the request body
    var body = await readBody(event)
    body = JSON.parse(body)

    if (typeof body.ID === "undefined") {
        return {
            "success": false,
             "message": "ID not defined"
         }
     }

    const ID = body.ID

    try {
        // const scenario = await Scenario.findOne({ _id: ID });

        // if (!scenario) {
        //     return {
        //         success: false,
        //         message: "Scenario not found",
        //     };
        // }

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