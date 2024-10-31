// Importaciones
const express = require("express");
const cors = require("cors");
const fs = require("node:fs");
const path = require("node:path");
const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const morgan = require("morgan");

// Configuración de la aplicación
const app = express();
const port = process.env.PORT || 3000;

// Configuración de middlewares
const setupMiddlewares = (app) => {
    // Middlewares integrados en Express v5
    app.use(express.json()); // Reemplazo de bodyParser.json()
    app.use(express.urlencoded({ extended: true })); // Reemplazo de bodyParser.urlencoded({ extended: true })
    app.use(cors());
    // Muestreo de informacion en consola
    app.use(morgan("dev"));
    // Uso de archivos estaticos (CSS y JS)
    app.use(express.static(path.join(__dirname, '..', 'public')));
};

// Funciones de utilidad para el manejo de usuarios
const usersUtil = {
    USERS_FILE: path.join(__dirname, '..', 'users', 'users.json'),
    
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

// Exportaciones
module.exports = {
    express,
    cors,
    fs,
    path,
    bcrypt,
    morgan,
    app,
    port,
    setupMiddlewares,
    usersUtil,
};