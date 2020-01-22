import Boom from '@hapi/boom';
import db from '../helpers/db/connection.js';
import crypto from 'crypto';
import uuid from 'uuid';
import nodemailer from 'nodemailer';

export default {
    /**
     * Получение данных для главной страницы
     * 
     * @param {*} req 
     * @param {*} h 
     */
    async getFeed(req, h) {
        try {
            return await db.post.find().sort({ _id: 1 }).limit(5);
        } catch (e) {
            return Boom.badRequest('Ошибка!');
        }
    },

    /**
     * Регистрация пользователя, пароль хешируется в md5 без соли
     * 
     * @param {*} req 
     * @param {*} h 
     */

    async registerUser(req, h) {

        try {
            const { login, password, email } = req.payload;
            const getUser = await db.user.findOne({ login: login });
            if (!getUser) {
                const mdPass = crypto.createHash('md5').update(password).digest("hex");
                const newUser = await db.user.create({
                    login: login,
                    password: mdPass,
                    email: email,
                });
                return newUser.userId;
            }
            return Boom.badRequest('Такой пользователь существует!');
        }
        catch (e) {
            return Boom.badRequest('Ошибка при регистрации');
        }
    },



    /**
     * Вход в систему если пользователь ввел валидные данные, сессия сохраняетс я в Redis 
     * 
     * @param {*} req 
     * @param {*} h 
     */

    async userLogin(req, h) {
        try {
            const { login, password } = req.payload;
            const getUser = await db.user.findOne({ login: login });
            let uPass = crypto.createHash('md5').update(password).digest("hex");

            //Если пользователь найден
            if (getUser.password === uPass) {
                const uToken = uuid.v4();

                //записываем в память данные логин + uuid 
                db.redis.set(uToken, getUser.login);

                return uToken;
            }
            return Boom.badRequest('Неверный логин или пароль');
        } catch (e) {
            return Boom.badRequest('Ошибка при входе в систему');
        }
    },


    /**
     * Удаление пользователя
     * 
     * @param {*} req 
     * @param {*} h 
     */
    async deleteUser(req) {
        try {
            const { credentials: user } = req.auth;
            const { userId } = req.query;
            console.log(userId);
            if (user.userId !== userId) {
                return Boom.forbidden('Нельзя удалить аккаунт другого пользователя');
            }

            await db.user.deleteOne({ userId });
            return 'ok';
        } catch (e) {
            return Boom.badRequest('Произошла ошибка, обратитесь к администратору!');
        }
    },

    /**
     * Редактирование поста, доступко только по стратегии для редактора, которую назначает админ
     * 
     * @param {*} req 
     * @param {*} h 
     */
    async editPost(req, h) {
        try {
            const { uid } = req.params;
            const { title, body } = req.payload;

            const findPost = await db.post.findOne({ postId: uid });

            if (findPost) {
                await db.post.update({ postId: uid }, { body: body, title: title });
                return 'OK!';
            }
        } catch (e) {
            return Boom.badRequest('Произошла ошибка, обратитесь к администратору!');
        }

    },

    /**
     * Получение одного постапо id поста
     * 
     * @param {*} req 
     * @param {*} h 
     */

    async getSinglePost(req, h) {
        const { pid } = req.params;
        try {
            return await db.post.find({ postId: pid });
        } catch (e) {
            return Boom.badRequest('Такого поста нет!');
        }

    },


    /**
     * Восстановление пароля, отсылка сообщения на Email и вывод в консоль
     * https://nodemailer.com/about/ - пакет для отправки емайлов 
     * 
     * @param {*} req 
     * @param {*} h 
     */
    async forgotPassword(req, h) {
        const { email } = req.payload;

        const findUser = await db.user.findOne({ email: email });
        //console.log(findUser);
        if (findUser) {
            let str = uuid.v4();
            let makePassword = str.substring(4, 10);
            let newPass = crypto.createHash('md5').update(makePassword).digest("hex");
            console.log('Новый пароль ' + makePassword);
            await db.user.updateOne({ email: email }, { password: newPass });

            //Настроки соединения с MAIL сервером 
            let transporter = nodemailer.createTransport({
                host: process.env.MAIL_HOST,
                port: parseInt(process.env.EMAIL_PORT || '587'),
                secure: (process.env.MAIL_SECURE || false), // true for 465, false for other ports
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_USER
                }
            });

            var mailOptions = {
                from: process.env.MAIL_FROM,
                to: email,
                subject: 'Сброс пароля',
                text: `<h1>Ваш новый пароль<h1> - <b>${newPass}</b>`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return (error);
                } else {
                    //return ('Email sent: ' + info.response);
                    return 'OK!';
                }
            });
            return 'OK!';
        }
        return Boom.badRequest('Такого пользователя нет');
    },

    /**
     * Получение всех пользователей, доступно для админов
     * 
     */
    async getAllUsers() {
        try {
            return await db.user.find().select('-hash');
        } catch (e) {
            return Boom.badRequest('Произошла ошибка, обратитесь к администратору!');
        }
    },


    /**
     * Добавление записей в Базу данных, доступно для авторизованных пользователей по стратегии user
     * 
     * @param {*} req 
     * @param {*} h 
     */
    async addPost(req, h) {
        try {
            const newPost = await db.post.create({
                title: req.payload.title,
                body: req.payload.body,
                tags: req.payload.tags,
            });
            //Добавление в индекс
            await db.searchClient.index({
                index: db.searchIndexPosts,
                // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
                body: {
                    Post_pid: newPost.postId,
                    Post_title: newPost.title,
                    Post_body: newPost.body,
                    Post_tags: newPost.tags
                }
            });
            //Обновление индекса, по хорошему, такие вещи делаются кроном раз в час например...
            await db.searchClient.indices.refresh({ index: db.searchIndexPosts });

            return newPost.postId;
        } catch (e) {
            return Boom.badRequest('Произошла ошибка, обратитесь к администратору!');
        }
    },

    /**
     * Добавление комментраиев
     * 
     * @param {*} req 
     * @param {*} h 
     */
    async addComment(req, h) {
        try {
            const newComment = await db.comment.create({
                postUid: req.payload.postUid,
                comment: req.payload.comment,
            });
            //Добавление в индекс
            await db.searchClient.index({
                index: db.searchIndexComments,
                // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
                body: {
                    postUid: req.payload.postUid,
                    comment: req.payload.comment
                }
            });
            //Обновление индекса, по хорошему, такие вещи делаются кроном раз в час например...
            await db.searchClient.indices.refresh({ index: db.searchIndexComments });

            // console.log(h);
            return newComment.commentId;

        } catch (e) {
            return Boom.badRequest('Произошла ошибка, обратитесь к администратору!');
        }
    },
    /**
     * Получение комментариев к посту
     * 
     * @param {*} req 
     * @param {*} h 
     */
    async getComment(req, h) {
        try {
            const { uid } = req.params;
            return await db.comment.find({ postUid: uid });
        } catch (e) {
            return Boom.badRequest('Произошла ошибка, обратитесь к администратору!');
        }
    },

    /**
     * Получение последних 10 записей из БД
     * 
     */
    async getLastTen() {
        try {
            return await db.post.find().sort({ _id: 1 }).limit(10);
        } catch (e) {
            return Boom.badRequest('Произошла ошибка, обратитесь к администратору!');
        }
    },
    /**
     * Система голосов передаваемый параметр - токен новости или пользователя 
     * 
     * @param {*} req 
     * @param {*} h 
     */
    async makeVote(req, h) {
        try {
            const { uid } = req.params;
            const { vote } = req.payload;

            await db.vote.create({
                thisUid: uid,
                carma: vote
            });
            //console.log(newVote);
            return `Голосование  - ${uid} ------ (${vote})`;
        } catch (e) {
            return Boom.badRequest('Произошла ошибка, обратитесь к администратору!');
        }
    },

    /**
     * Назначение пользователя редактором, доступно только для админа 
     * 
     * @param {*} req 
     * @param {*} h 
     */
    async makeRedactor(req, h) {
        try {
            const { uid } = req.params;
            const rToken = uuid.v4();
            const findUser = await db.user.findOne({ userId: uid });
            console.log(uid)
            if (findUser) {
                await db.user.updateOne({ userId: uid }, { tokenRedactor: rToken });
                return 'OK!';
            }
            console.log(findUser)
            return Boom.badRequest('Такого пользователя нет');
        } catch (e) {
            return Boom.badRequest('Произошла ошибка, обратитесь к администратору!');
        }
    },


    /**
     * Удаление сессии пользователся
     * 
     * @param {*} req 
     * @param {*} h 
     */
    async flushUserToken(req) {
        try {
            const { credentials: token } = req.auth;

            db.redis.del(token.token);
            return 'OK!';
        } catch (e) {
            return Boom.badRequest('Произошла ошибка, обратитесь к администратору!');
        }
    },
    /**
     * Удаление Всех сессий из Редис
     * 
     * @param {*} req 
     * @param {*} h 
     */
    async flushAllTokens() {
        try {
            db.redis.flushall((err, success) => {
                if (err) {
                    throw new Error(err);
                }
            });

            return 'OK!';
        } catch (e) {
            return Boom.badRequest('Произошла ошибка, обратитесь к администратору!');
        }
    },

    /**
     * Поиск по сайту, полнотекстовый - используется ElasticSearch. Ищет по титлам, содержанию статьи, пользователям и тэгам .
     * 
     * @param {*} req 
     */
    async makeSearch(req) {
        const { query, where } = req.query;
        switch (where) {
            case "user":
                return db.user.find({ login: query });
            case "p_body":
                try {
                    var { body } = await db.searchClient.search({
                        index: db.searchIndexPosts,
                        // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
                        body: {
                            query: {
                                match: { Post_body: query }
                            }
                        }
                    })
                    if (body.hits.hits.length == 0) {
                        return "Записей нет";
                    }
                    return body.hits.hits;
                } catch (e) {
                    return Boom.badRequest('Произошла ошибка, обратитесь к администратору!');
                }
            case "p_tags":
                try {
                    var { body } = await db.searchClient.search({
                        index: db.searchIndexPosts,
                        // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
                        body: {
                            query: {
                                match: { Post_tags: query }
                            }
                        }
                    })
                    if (body.hits.hits.length == 0) {
                        return "Записей нет";
                    }
                    return body.hits.hits;
                } catch (e) {
                    return Boom.badRequest('Произошла ошибка, обратитесь к администратору!');
                }
            case "p_title":
                try {
                    var { body } = await db.searchClient.search({
                        index: db.searchIndexPosts,
                        // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
                        body: {
                            query: {
                                match: { Post_title: query }
                            }
                        }
                    })
                    if (body.hits.hits.length == 0) {
                        return "Записей нет";
                    }
                    return body.hits.hits;
                } catch (e) {
                    return Boom.badRequest('Произошла ошибка, обратитесь к администратору!');
                }
            case "c_comment":
                try {
                    var { body } = await db.searchClient.search({
                        index: db.searchIndexComments,
                        // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
                        body: {
                            query: {
                                match: { Post_tags: query }
                            }
                        }
                    })
                    if (body.hits.hits.length == 0) {
                        return "Записей нет";
                    }
                    return body.hits.hits;
                } catch (e) {
                    return Boom.badRequest('Произошла ошибка, обратитесь к администратору!');
                }
            default:
                return "Укажите, где осуществить поиск";
        }

    },
};