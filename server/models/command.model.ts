import { Schema, model } from "mongoose";

const CommandSchema = new Schema({
    _id: String,
    command_name: String,
    command_content: String,
});

export const Command = model("Command", CommandSchema);