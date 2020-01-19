import mongoose from 'mongoose';
import uuid from 'uuid';
/**
 * Дамп таблицы комментриевы
 * 
 */
const commentSchema = new mongoose.Schema(
    {
        postUid: {
            type: String,
            required: true,
            default: false,
        },
        comment: {
            type: String,
            required: true,
            default: false,
        }, 
        commentId: {
            type: String,
            unique: true,
            default: uuid.v4,
        },
    },
    {
        timestamps: true
    }
);

export default commentSchema;