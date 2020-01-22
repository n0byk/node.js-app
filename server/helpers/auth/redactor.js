import db from '../db/connection.js'


export default function(server) {
    server.auth.strategy('redactor', 'bearer-access-token', {
        validate: async (request, token, h) => {
            const user = await db.user.findOne({ tokenRedactor: token });
            if (user) {
                return {
                    isValid: true,
                    credentials: user,
                    artifacts: {},
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
