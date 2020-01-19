import db from '../db/connection.js'

/**
 * Стратегия авторизации пользователся, токен хранится в Redis
 * 
 * @param {*} server 
 */

export default function (server) {
    server.auth.strategy('user', 'bearer-access-token', {
        validate: async (request, token, h) => {
//Данные из Редис
            const getUserToken = await db.redis.getAsync(token).then(function (res) {
                return res;
            });

            if (getUserToken) {
                const user = await db.user.findOne({ login: getUserToken });

                if (user) {
 
                    return {
                        isValid: true,
                        credentials: {user, token},
                        artifacts: {},
                    }
                }

            }
            return {
                isValid: false,
                credentials: {},
                artifacts: {},
            };
        }
    });
}