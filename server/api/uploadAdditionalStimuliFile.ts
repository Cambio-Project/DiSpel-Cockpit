import {User} from "~/server/models/user.model";
import fs from "fs";

export default defineEventHandler(async (event) => {

    const body = await readBody(event)
    console.log(body)
    //fs.promises.writeFile(fileName, JSON.stringify(fileContent));

    return {
        "offline": true
    };
})