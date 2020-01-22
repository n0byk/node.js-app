import mongoose from 'mongoose';
/**
 * Дамп таблицы Голосований, хранит в себе информацию о голосовании за новости или комментарии или пользователи(опционально).
 * 
 */
const voteSchema = new mongoose.Schema(
    {
        thisUid: {
            type: String,
            required: true,
            default: false,
        },
        carma: {
            type: String,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true
    }
);

export default voteSchema;