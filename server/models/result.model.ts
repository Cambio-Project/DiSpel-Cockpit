import {Schema, model} from "mongoose";

const ResultSchema = new Schema({
    simulationID: String,
    simulationNames: [String],
    simulationResults: [[Boolean]],
    simulationResultsTotal: Number,
    simulationResultsResponseSuccesses: [Number],
    simulationResultsScenarioSuccesses: [Boolean],
    simulationResultsScenarioSuccessesTotal: Number,
    searchNames: [String],
    searchResults: [[Boolean]],
    searchResultsTotal: Number,
    searchResultsResponseSuccesses: [Number],
    searchResultsScenarioSuccesses: [Boolean],
    searchResultsScenarioSuccessesTotal: Number,
});

export const Result = model("Result", ResultSchema);