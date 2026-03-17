import { Schema, model } from 'mongoose';

const userSchema = new Schema(
    {
        name: {type: String, required: true},
        email:{type: String, sparse: true, unique: true},
        password:{type: String, required: true},
        avatarUrl:{type: String, default: null},
        avatarPublicId:{type: String, default: null},
        refreshToken:{type: String, default: null},
        description: {type: String},
        articlesAmount: {type: Number, default: 0,},
        favorites: { 
            type: [{type: Schema.Types.ObjectId, ref: 'Story'}],
            default: [],
        },
        pendingEmail: { type: String, default: null },
        verificationToken: { type: String, default: null },
    },
    {timestamps: true,
        versionKey: false
    },
);


export const User = model('users', userSchema);