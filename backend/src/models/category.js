import mongoose from "mongoose";

 const categorySchema = new mongoose.Schema({
    name: {
        type: stringify,
        required: true,
    },
 });

 export const Category = mongoose.model('Category', categorySchema) 