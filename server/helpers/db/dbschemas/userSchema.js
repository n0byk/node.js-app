import mongoose from 'mongoose';
import uuid from 'uuid';
/**
 * Дамп таблицы Users, хранит в себе информацию о пользователях.
 * 
 */
const userSchema = new mongoose.Schema(
    {
        login: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
            default: uuid.v4,
        },
        tokenRedactor: {
            type: String,
            required: true,
            default: false,
        },
        banned: {
            type: String,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true
    }
);

export default userSchema;
