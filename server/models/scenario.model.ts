import {Schema, model} from "mongoose";

const ScenarioSchema = new Schema({
    simulationID: String,
    executionID: String,
    name: String,
    category: String,
    description: String,
    environment: {
        architecture: [{}],
        experiment: [{}],
        load: [{}],
        monitoringData: [{}],
    },
    architectureData: {
        serviceNames: [String],
        endpointNames: [String],
    },
    searchWindowSize: String,
    stimuli: [{}],
    responses: [{}],
    specification: {
        measurementSources: [{}]
    }
});

export const Scenario = model("Scenario", ScenarioSchema);