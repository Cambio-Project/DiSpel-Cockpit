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
    prometheusStartTimestamp: Number,
    secondsPerTimeStep: Number,
    stimuli: [{}],
    responses: [{}],
    specification: {
        measurementSources: [{}],
        commands: [{
            command_name: String,
            command_content: String,
            global: Boolean
        }
        ],
        listeners: [{
            listener_name: String,
            listener_content: String,
            global: Boolean
        }],
        events: [{
            event_name: String,
            predicate_name: String,
            predicate_logic: String,
            predicate_comparison_value: String,
            measurement_source: String,
            global: Boolean
        }]
    }
});

export const Scenario = model("Scenario", ScenarioSchema);