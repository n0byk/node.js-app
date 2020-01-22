/**
 * Стратегия авторизации администратора, токен хранится в MONGO и добавляется при назначении пользователя админом.
 * 
 * @param {*} server 
 */
export default function(server) {
    server.auth.strategy('admin', 'bearer-access-token', {
        validate: async (request, token, h) => {
            const isValid = token === process.env.ADMIN_TOKEN;
            if (isValid) {
                return {
                    isValid,
                    credentials: { admin: { isAdmin: true } },
                    artifacts: {},
                }
            }

            return {
                isValid,
                credentials: {},
                artifacts: {},
            };
        }
    });
}
