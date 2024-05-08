import {Command} from "~/server/models/command.model";

export default defineEventHandler(async (event) => {

    let commands: any = []

    try {
        commands = await Command.find({})
    } catch (e) {
        console.log("Error finding commands")
    }

    return commands
});