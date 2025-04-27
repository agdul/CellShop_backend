require ('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const Database = require('./src/config/database');


class Servidor {
    constructor(){
        this.app = express();
        this.port = process.env.PORT || 3001;
        this.host = process.env.HOST || 'localhost';

    }

    middlewares(){
        this.app.use(morgan('dev'));
        this.app.use(express.json());
    }

    routes(){
        this.app.use('/', require('./src/routes'));
    }


    async dbConnection(){
        const db = new Database();
        await db.maindb();
    }

    listen(){
        this.app.listen(this.port, this.host, () => {
            console.log(`✅ Servidor corriendo en http://${this.host}:${this.port}`);
        });
    }

    async mainserver(){
        this.middlewares();
        this.routes();
        await this.dbConnection();
        this.listen();
    }

}

const server = new Servidor();
server.mainserver();