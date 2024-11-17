import mongoose, { Schema } from "mongoose";
import { ObjectId } from 'mongodb';
const userSchema = new Schema({
    _id: ObjectId,
    username: String,
    //roles: [String],
    //username: { type: String, required: true }, not working
    password: String,
    email: String,
});
export const User = mongoose.model("user", userSchema);
