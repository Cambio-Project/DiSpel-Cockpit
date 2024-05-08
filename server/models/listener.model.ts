import { Schema, model } from "mongoose";

const ListenerSchema = new Schema({
    _id: String,
    listener_name: String,
    listener_content: String,
});

export const Listener = model("Listener", ListenerSchema);