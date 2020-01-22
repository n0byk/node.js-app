import mongoose from 'mongoose';
import uuid from 'uuid';

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        tags: {
            type: String,
            required: true,
        },
        postId: {
            type: String,
            unique: true,
            default: uuid.v4,
        },
    },
    {
        timestamps: true
    }
);


export default postSchema;
