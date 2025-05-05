import { Schema, model } from "mongoose";

const EventSchema = new Schema({
    _id: String,
    event_name: String,
    predicate_name: String,
    predicate_logic: String,
    predicate_comparison_value: String,
    measurement_source: String,
    predicate_global: { type: Boolean, default: true },
});

export const Event = model("Event", EventSchema);