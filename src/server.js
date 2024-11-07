/*
Autor: Misaint20
Descripcion: Servidor de express 5.0
Nota: Esta es parte de una prueba de la ultima actualizacion de express.js para la implementacion de un API REST con metodo CRUD y más...
*/

//Importaciones
const express = require('express');
const { setupMiddlewares } = require('./config/app.config');
const routes = require('./routes');
const updateRepoStructure = require('./utils/repoStructure');

// Iniciar la aplicación
const app = express();

// Configurar middlewares
setupMiddlewares(app);

// Configurar rutas
app.use('/api/v1', routes);

// Iniciar el servidor
if (process.env.NODE_ENV !== 'test') {
    const port = process.env.PORT || 3000;
    app.listen(port, async () => {
        console.log(`Server running on http://localhost:${port}`);
        await updateRepoStructure();
    });
}

module.exports = app;