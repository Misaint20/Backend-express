// routes/auth.js
const express = require("express");
const router = express.Router();
const { bcrypt, usersUtil } = require("../config/config");

// Ruta de Registro de Usuarios
router.post("/register", async (req, res) => {
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
router.post("/login", async (req, res) => {
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

module.exports = router;
