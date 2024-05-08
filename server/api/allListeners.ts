import {Listener} from "~/server/models/listener.model";

export default defineEventHandler(async (event) => {

    let listeners: any = []

    try {
        listeners = await Listener.find({})
    } catch (e) {
        console.log("Error finding events")
    }

    return listeners
});