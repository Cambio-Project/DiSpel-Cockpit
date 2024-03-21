import { Schema, model } from "mongoose";

// data model for users (used for MongoDB)
const UserSchema = new Schema({
    name: String,
    email: String,
});

export const User = model("User", UserSchema);