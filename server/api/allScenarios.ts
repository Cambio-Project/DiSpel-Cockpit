import {Scenario} from "~/server/models/scenario.model";
import * as crypto from "crypto";

export default defineEventHandler(async (event) => {

    let scenarios:any = []

    try {
        scenarios = await Scenario.find({})
    } catch (e) {
        console.log("Error finding scenarios")
    }

    return {
        scenarios: scenarios
    };
});