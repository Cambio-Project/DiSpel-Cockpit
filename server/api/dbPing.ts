import {User} from "~/server/models/user.model";

export default defineEventHandler(async (event) => {

    var body = await readBody(event)
    body = JSON.parse(body)

    if (typeof body.simulationID === "undefined") {
        return {
            "success": false,
        }
    }

    //TODO Switch


    return {
        "offline": true
    };
})