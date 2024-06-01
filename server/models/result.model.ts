import {Schema, model} from "mongoose";

const ResultSchema = new Schema({
    simulationID: String,
    resilienceScore: Number,
    simulationUpdateRequired: Boolean,
    simulationNames: [String],
    simulationResults: [[Boolean]],
    simulationResultsTotal: Number,
    simulationResultsResponseSuccesses: [Number],
    simulationResultsScenarioSuccesses: [Boolean],
    simulationResultsScenarioSuccessesTotal: Number,
    searchUpdateRequired: Boolean,
    searchNames: [String],
    searchResults: [[Boolean]],
    searchResultsTotal: Number,
    searchResultsResponseSuccesses: [Number],
    searchResultsScenarioSuccesses: [Boolean],
    searchResultsScenarioSuccessesTotal: Number,
});

export const Result = model("Result", ResultSchema);