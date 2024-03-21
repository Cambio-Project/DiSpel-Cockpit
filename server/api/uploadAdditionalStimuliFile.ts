import {User} from "~/server/models/user.model";
import fs from "fs";

// endpoint for uploading additional stimuli files
export default defineEventHandler(async (event) => {

    const body = await readBody(event)
    const files = await readMultipartFormData(event)
    await fs.promises.writeFile("./uploaded/"+files![0].filename, files![0].data);

    return {
        "success": true
    };
})