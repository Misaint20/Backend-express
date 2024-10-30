/*
Autor: Misaint20
Descripcion: Servidor de express 5.0
Nota: Esta es parte de una prueba de la ultima actualizacion de express.js para la implementacion de un API REST con metodo CRUD y más...
*/

// Importaciones
const express = require("express");
const cors = require("cors");
const fs = require("node:fs");
const path = require("node:path");
const app = express();
const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const port = process.env.PORT || 3000;

// Middlewares integrados en Express v5
app.use(express.json()); // Reemplazo de bodyParser.json()
app.use(express.urlencoded({ extended: true })); // Reemplazo de bodyParser.urlencoded({ extended: true })
app.use(cors());
// Muestreo de informacion en consola
app.use(morgan("dev"));

/* -- SISTEMA DE REGISTRO E INICIO DE SESIONES -- */

// Archivo de usuarios (Esto se recomienda cambiar por una base de datos para un proyecto real)
const USERS_FILE = path.join(__dirname, "users", "users.json");

// Carga de usuarios
const readUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
  } catch (err) {
    return [];
  }
};

// Guarda de usuarios
const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Ruta de Registro de Usuarios
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  /* Validaciones de todos los datos enviados */
  // Validacion de datos
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing data" });
  }

  // Validacion de email
  if (!email.includes("@")) {
    return res.status(400).json({ error: "Invalid email" });
  }

  // Validacion de password
  if (password.length < 8) {
    return res.status(400).json({ error: "Password too short" });
  }

  // Validacion de usuarios
  const users = readUsers();
  const user = users.find((u) => u.email === email);
  if (user) {
    return res.status(400).json({ error: "User already exists" });
  }
  /* Fin de validaciones de todos los datos enviados */

  //Hash de password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Creacion de nuevo usuario
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password: hashedPassword,
  };

  // Envio de usuario a la lista de usuarios
  users.push(newUser);
  writeUsers(users);

  // Envio de respuesta
  res.json({ message: "User created successfully" });
});

// Ruta de Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validacion de datos
  if (!email || !password) {
    return res.status(400).json({ error: "Missing data" });
  }

  // Validacion de usuarios
  const users = readUsers();
  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  // Validacion de password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: "Invalid password" });
  }

  // Generacion de token
  //   const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  // Envio de respuesta
  res.json({ message: "Login successful", user });
});

/* -- FIN DE REGISTRO E INICIO DE SESIONES -- */

// Actualizacion de usuarios
app.put("/users/:id", (req, res) => {
  const users = readUsers();
  const userIndex = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  const { name, email, password } = req.body;

  // Opcional: validar los nuevos datos antes de actualizar
  if (password) {
    const salt = bcrypt.genSaltSync(10);
    users[userIndex].password = bcrypt.hashSync(password, salt);
  }

  if (name) users[userIndex].name = name;
  if (email) users[userIndex].email = email;

  writeUsers(users);
  res.json({ message: "User updated successfully", user: users[userIndex] });
});

// Ruta de inicio donde ira la documentacion
app.get("/", (req, res) => {
  res.send("Documentation page");
});

// Ruta de usuarios API
app.get("/api/users", (req, res) => {
  const users = readUsers();
  // Excluir contraseñas
  const safeUsers = users.map(({ name, email }) => ({ name, email }));
  res.json(safeUsers);
});

// Ruta para mostrar la lista de usuarios
app.get("/users", (req, res) => {
  res.sendFile(path.join(__dirname, "public",'users', "users.html"));
});

// Ruta de usuario especifico
app.get("/users/:id", (req, res) => {
  const users = readUsers();
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

// Eliminacion de usuario
app.delete("/users/:id", (req, res) => {
  const users = readUsers();
  const newUsers = users.filter((u) => u.id !== parseInt(req.params.id));

  if (users.length === newUsers.length) {
    return res.status(404).json({ error: "User not found" });
  }

  writeUsers(newUsers);
  res.json({ message: "User deleted successfully" });
});

// Activacion del puerto para correr el servidor
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
