import fs from "fs";

export default defineEventHandler(async (event) => {

    const files = await readMultipartFormData(event)
    await fs.promises.writeFile("./uploaded/"+files![0].filename, files![0].data);

    return {
        "success": true
    };
})