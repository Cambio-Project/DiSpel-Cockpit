import { Schema, model } from "mongoose";

const ListenerSchema = new Schema({
    _id: String,
    listener_name: String,
    listener_content: String,
    listener_global: { type: Boolean, default: true }
});

export const Listener = model("Listener", ListenerSchema);