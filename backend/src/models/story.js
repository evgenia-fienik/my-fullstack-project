import mongoose  from "mongoose";
import {Category} from './category.js'
import { User } from './user.js';

const storySchema = new mongoose.Schema ({
    img: String,
    title: String,
    article: String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', 
    }, 
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    date: String,
    favoriteCount: {
        type: Number, 
        default: 0,
    },
});

export const Story = mongoose.model('Story', storySchema);