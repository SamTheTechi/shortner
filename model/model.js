import {Schema, model} from "mongoose";

const urlSchema = new Schema({
    origial: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    short: {
        type: String,
        required: true,
        unique: true,
        index: true,
    }
})

export const URLSchema = model("URLSchema", urlSchema);