import controllers from './controllers/controllers.js';
import Joi from '@hapi/joi';

/**
 * Все роуты сервера
 * 
 */

export default [
    /**
     * Роут для получения глывной страницы 
     */
    {
        method: 'GET',
        path: '/feed',
        handler: controllers.getFeed,
    },
    /**
     * Роут для отдачи файлов
     */
    {
        method: 'GET',
        path: '/fileserver/{file*}',
        handler: {
            directory: {
                path: './uploads',
                redirectToSlash: true,
                index: true,
            },
        },
    },
    /**
     * Роут для добавления новостей, доступен для авторизовынных пользователей, стратегия User 
     */
    {
        method: 'POST',
        path: '/addpost',
        handler: controllers.addPost,
        options: {
            validate: {
                payload: Joi.object({
                    title: Joi.string().required(),
                    body: Joi.string().required(),
                    tags: Joi.string().required(),
                }).required()
            },
            auth: {
                strategy: 'user'
            }
        }
    },
    /**
* Роут для редактирования, доступен для авторизовынных пользователей, стратегия redactor 
*/
    {
        method: 'POST',
        path: '/editpost/{uid}',
        handler: controllers.editPost,
        options: {
            validate: {
                payload: Joi.object({
                    title: Joi.string().required(),
                    body: Joi.string().required(),
                    //tags: Joi.string().required(),
                }).required()
            },
            auth: {
                strategy: 'redactor'
            }
        }
    },
    /**
     * Роут для комментариев
     */
    {
        method: 'POST',
        path: '/addcomment',
        handler: controllers.addComment,
        options: {
            validate: {
                payload: Joi.object({
                    postUid: Joi.string().required(),
                    comment: Joi.string().required(),
                }).required(),
            },
            auth: {
                strategy: 'user'
            }
        }
    },
    /**
     * Роут получения комментариев
     */
    {
        method: 'GET',
        path: '/getcomment/{uid}',
        handler: controllers.getComment,
        options: {
            validate: {
                params: Joi.object({
                    uid: Joi.string().required(),
                }).required(),
            }
        }
    },
    /**
     * Роут получение последних 10 постов
     */
    {
        method: 'GET',
        path: '/getlast',
        handler: controllers.getLastTen,
    },

    /**
     * Роут регистрации пользователей 
     */
    {
        method: 'POST',
        path: '/user/registration',
        handler: controllers.registerUser,
        options: {
            validate: {
                payload: Joi.object({
                    login: Joi.string().required(),
                    password: Joi.string().required(),
                    email: Joi.string().email().max(256).example('pupkin@gmail.com').required(),
                }).required()
            }
        }
    },
    /**
     * Роут входа в систему и получения токена, если вход выполнен
     */
    {
        method: 'POST',
        path: '/user/login',
        handler: controllers.userLogin,
        options: {
            validate: {
                payload: Joi.object({
                    login: Joi.string().required(),
                    password: Joi.string().required(),
                }).required()
            }
        }
    },
    /**
     * Роут длоя получения списка пользователей, доступен по стратегии admin
     */
    {
        method: 'GET',
        path: '/user/getall',
        handler: controllers.getAllUsers,
        options: {
            auth: {
                strategy: 'admin'
            }
        }
    },
    /**
     * Роут удаления пользователеля, доступен авторизованныму пользователю и админам
     */
    {
        method: 'DELETE',
        path: '/user/delete',
        handler: controllers.deleteUser,
        options: {
            validate: {
                query: Joi.object({
                    userId: Joi.string().required(),
                }).required(),
            },
            auth: {
                strategy: 'user',
            }
        }
    },
    /**
     * Роут выходы из системы - удаление токена
     */
    {
        method: 'DELETE',
        path: '/user/logout',
        handler: controllers.flushUserToken,
        options: {
            auth: {
                strategy: 'user',
            }
        }
    },
    /**
     * Роут восстановления пароля, доступен при указании Email
     */
    {
        method: 'POST',
        path: '/user/forgotpassword',
        handler: controllers.forgotPassword,
        options: {
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().max(256).example('pupkin@gmail.com').required(),
                }).required(),
            },
        }
    },
    /**
     * Роут для голосования
     */
    {
        method: 'POST',
        path: '/vote/{uid}',
        handler: controllers.makeVote,
        options: {
            validate: {
                params: Joi.object({
                    uid: Joi.string().required(),
                }).required(),
            },
            auth: {
                strategy: 'user'
            }
        }
    },
    /**
     * Роут для получения поста
     */

    {
        method: 'GET',
        path: '/post/{pid}',
        handler: controllers.getSinglePost,
        options: {
            validate: {
                params: Joi.object({
                    pid: Joi.string().required(),
                }).required(),
            }
        }
    },
    /**
     * Назначение прав доступа "Редактор" - только админ может делать данно действие
     */
    {
        method: 'POST',
        path: '/makeredactor/{uid}',
        handler: controllers.makeRedactor,
        options: {
            validate: {
                params: Joi.object({
                    uid: Joi.string().required(),
                }).required(),
            },
            auth: {
                strategy: 'admin'
            }
        }
    },
    /**
     * Удаление всех записей в хранилище redis. доступно по стратегии админ
     */
    {
        method: 'DELETE',
        path: '/deleteallsessions',
        handler: controllers.flushAllTokens,
        options: {
            auth: {
                strategy: 'admin'
            }
        }
    },
    {
        method: 'POST',
        path: '/search',
        handler: controllers.makeSearch,
        options: {
            validate: {
                query: Joi.object({
                    query: Joi.string().required(),
                    where: Joi.string().required()
                }).required(),
            }
        }
    }
];