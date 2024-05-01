import { Schema, model } from "mongoose";

const ScenarioSchema = new Schema({
    simulationID: String,
    name: String,
    category: String,
    description: String,
    environment: {
        architecture: [{}],
        experiment: [{}],
        load: [{}],
        monitoringData: [{}],
        mtlFiles: [{}]
    },
    stimuli: [{}],
    responses: [{}]
});

export const Scenario = model("Scenario", ScenarioSchema);