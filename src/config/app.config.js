const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('node:path');
const fs = require("node:fs");
const { logger } = require('../utils/logger');

const app = express();

// Configuración básica
const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
};

// Configuración de middlewares
const setupMiddlewares = (app) => {
    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan('dev', { stream: { write: message => logger.info(message.trim()) } }));
    app.use(express.static(path.join(__dirname, '../../public')));
};

const usersUtil = {
    USERS_FILE: process.env.NODE_ENV === 'test' 
        ? path.join(__dirname, '..', '..', 'data', 'test-users.json')
        : path.join(__dirname, '..', 'data', 'users.json'),
    
    readUsers: () => {
        try {
            return JSON.parse(fs.readFileSync(usersUtil.USERS_FILE, "utf8"));
        } catch (err) {
            return [];
        }
    },
    
    writeUsers: (users) => {
        fs.writeFileSync(usersUtil.USERS_FILE, JSON.stringify(users, null, 2));
    }
};

module.exports = {
    app,
    config,
    setupMiddlewares,
    usersUtil,
};