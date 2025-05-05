import { Schema, model } from "mongoose";

const CommandSchema = new Schema({
    _id: String,
    command_name: String,
    command_content: String,
    command_global: { type: Boolean, default: true }
});

export const Command = model("Command", CommandSchema);