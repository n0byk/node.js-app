"use strict";
import dotenv from "dotenv";
import * as path from "path";
import Hapi from "@hapi/hapi";
import Inert from "@hapi/inert";
import AuthBearer from "hapi-auth-bearer-token";
import makeAdminAuth from "./helpers/auth/admin.js";
import makeUserAuth from "./helpers/auth/user.js";
import makeRedactorAuth from "./helpers/auth/redactor.js";

//Add some GOOD stuff
import fs from "fs";
import cluster from "cluster";
import os from "os";

//Add some routes
import routes from "./routes.js";

dotenv.config({
    path: path.join(path.resolve(), ".env")
});

//настройки https
if (process.env.SERVER_PRIVAT_KEY && process.env.SERVER_CERT) {
    var tls = {
        key: fs.readFileSync(process.env.SERVER_PRIVAT_KEY),
        cert: fs.readFileSync(process.env.SERVER_CERT)
    };
};



const init = async () => {
    const server = Hapi.server({
		//server.connection({address: '0.0.0.0', port: 443, tls: tls });
//server.connection({address: '0.0.0.0', port: 80 });
		
        host: process.env.SERVER_HOST || "localhost", port: parseInt(process.env.SERVER_PORT || "7000"),
        //host: process.env.SERVER_HOST || "localhost", port: parseInt(process.env.SERVER_PORT_SSL || "443"), tls: tls,
        routes: {
            validate: {
                failAction: (request, h, err) => {
                    if (process.env.NODE_ENV === "production") {
                        // In prod, log a limited error message and throw the default Bad Request error.
                        console.error("ValidationError:", err.message); // Better to use an actual logger here.
                        throw new Error(`Invalid request payload input`);
                    } else {
                        // During development, log and respond with the full error.
                        console.error(err);
                        throw err;
                    }
                }
            },
            //Нужно для кросс запросов
            cors: {
                origin: ["*"], // an array of origins or 'ignore'
                headers: ["Authorization"], // an array of strings - 'Access-Control-Allow-Headers'
                exposedHeaders: ["Accept"], // an array of exposed headers - 'Access-Control-Expose-Headers',
                additionalExposedHeaders: ["Accept"], // an array of additional exposed headers
                maxAge: 60,
                credentials: true // boolean - 'Access-Control-Allow-Credentials'
            }
        }
    });

    await server.register([Inert, AuthBearer]);

    makeAdminAuth(server);
    makeUserAuth(server);
    makeRedactorAuth(server);

    server.route(routes);

    //Кластер, под нагрузкой - практически не реально уронить
    if (process.env.SERVER_CLUSTER === "true") {
        if (cluster.isMaster) {
            var numWorkers = os.cpus().length;

            console.log('Master cluster setting up ' + numWorkers + ' workers...');

            for (var i = 0; i < numWorkers; i++) {
                cluster.fork();
            }

            cluster.on('online', function (worker) {
                console.log('Worker ' + worker.process.pid + ' is online');
            });

            cluster.on('exit', function (worker, code, signal) {
                console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
                console.log('Starting a new worker');
                cluster.fork();
            });
        } else {

            await server.start();
            console.log("Server running on %s", server.info.uri);
            console.log("Average CPU %s", os.loadavg());

        }
        //Запускаем без кластера
    } else {
        await server.start();
        console.log("Server running on %s", server.info.uri);
        console.log("Average CPU %s", os.loadavg());
    }


};

process.on("unhandledRejection", err => {
    console.log(err);
    process.exit(1);
});

init();
