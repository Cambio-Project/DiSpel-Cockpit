import {Schema, model} from "mongoose";

export interface SearchName {
    id: number;
    fileName: string;
    RelativeStartTime: number;
    RelativeEndTime: number;
}

const NamedSearchSchema = new Schema({
    id: Number,
    fileName: String,
    RelativeStartTime: Number,
    RelativeEndTime: Number
}, { _id: false }); // Disable _id for subdocuments if not needed

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
    searchNames: [NamedSearchSchema], // Updated here
    searchResults: [[Boolean]],
    searchResultsTotal: Number,
    searchResultsResponseSuccesses: [Number],
    searchResultsScenarioSuccesses: [Boolean],
    searchResultsScenarioSuccessesTotal: Number,
});

export const Result = model("Result", ResultSchema);