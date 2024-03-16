import { Schema, model } from "mongoose";

const ScenarioSchema = new Schema({
    simulationID: String,
    name: String,
    category: String,
    description: String,
    stimuli: [{}],
    responses: [{}]
});

export const Scenario = model("Scenario", ScenarioSchema);