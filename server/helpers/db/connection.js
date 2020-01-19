//Схемы баз данных
import userSchema from './dbschemas/userSchema.js';
import postSchema from './dbschemas/postSchema.js';
import voteSchema from './dbschemas/voteSchema.js';
import commentSchema from './dbschemas/commentSchema.js';
//------------------------------
import mongoose from 'mongoose';

//redis package
import redisServer from 'redis';
import Bluebird from 'bluebird';
Bluebird.promisifyAll(redisServer.RedisClient.prototype);
Bluebird.promisifyAll(redisServer.Multi.prototype);
//------------------------------

//Search Engine (Поисковая машина с блэкджеком...)
import SClient from '@elastic/elasticsearch';
const { Client } = SClient;

const elasticUrl = process.env.ELASTIC_URL || "http://localhost:9200";
const searchClient = new Client({ node: elasticUrl });

//Название поискового индекса
const searchIndexPosts = process.env.ELASTIC_INDEX_POSTS || "blog_index";
const searchIndexComments = process.env.ELASTIC_INDEX_COMMENTS || "comments_index";

function checkConnection() {
    return new Promise(async (resolve) => {
        console.log("Checking connection to ElasticSearch...");
        let isConnected = false;
        while (!isConnected) {
            try {
                await searchClient.cluster.health({});
                console.log("Successfully connected to ElasticSearch");
                isConnected = true;
                // eslint-disable-next-line no-empty
            } catch (_) {
            }
        }
        resolve(true);
    });
}
checkConnection();
//------------------------------





const hostPort = `${process.env.MONGO_HOST || 'localhost'}:${process.env.MONGO_PORT || '27017'}`;

mongoose.connect(`mongodb://${hostPort}/site`, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Successfully connected to MongoDB');
});




//Настройки Redis 
var redis = redisServer.createClient({
    retry_strategy: function (options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error and flush all commands with
            // a individual error
            return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands
            // with a individual error
            return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
            // End reconnecting with built in error
            return undefined;
        }
        // reconnect after
        return Math.min(options.attempt * 100, 3000);
    }
});



const user = mongoose.model('user', userSchema);
const post = mongoose.model('post', postSchema);
const vote = mongoose.model('vote', voteSchema);
const comment = mongoose.model('comment', commentSchema);


export default {
    user,
    post,
    vote,
    comment,
    redis,
    searchClient,
    searchIndexPosts,
    searchIndexComments
}