/*
Autor: Misaint20
Descripcion: Servidor de express 5.0
Nota: Esta es parte de una prueba de la ultima actualizacion de express.js para la implementacion de un API REST con metodo CRUD y más...
*/

const {
    app,
    port,
    path,
    setupMiddlewares
} = require('./config/config');

// Importar rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

// Configurar middlewares
setupMiddlewares(app);

// Ruta de inicio
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Usar las rutas
app.use('/', authRoutes); // Para mantener las rutas /login y /register en la raíz
app.use('/users', userRoutes);

// Iniciar servidor
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});