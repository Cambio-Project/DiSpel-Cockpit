import { Schema, model } from "mongoose";

const ScenarioSchema = new Schema({
    simulationID: String,
    category: String,
    description: String,
    stimuli: [{}],
    responses: [[{}]]
});

export const Scenario = model("Scenario", ScenarioSchema);