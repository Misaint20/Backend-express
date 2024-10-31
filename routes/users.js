const { express, bcrypt, usersUtil, path } = require('../config/config');
const router = express.Router();

// Ruta para mostrar la lista de usuarios
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '..', "public", "users.html"));
});

// Ruta de usuarios API
router.get("/api", (req, res) => {
    const users = usersUtil.readUsers();
    const safeUsers = users.map(({ name, email }) => ({ name, email }));
    res.json(safeUsers);
});

// Ruta de usuario específico
router.get("/:id", (req, res) => {
    const users = usersUtil.readUsers();
    const user = users.find((u) => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
});

// Actualización de usuarios
router.put("/:id", (req, res) => {
    const users = usersUtil.readUsers();
    const userIndex = users.findIndex((u) => u.id === parseInt(req.params.id));
    if (userIndex === -1) {
        return res.status(404).json({ error: "User not found" });
    }

    const { name, email, password } = req.body;

    if (password) {
        const salt = bcrypt.genSaltSync(10);
        users[userIndex].password = bcrypt.hashSync(password, salt);
    }

    if (name) users[userIndex].name = name;
    if (email) users[userIndex].email = email;

    usersUtil.writeUsers(users);
    res.json({ message: "User updated successfully", user: users[userIndex] });
});

// Eliminación de usuario
router.delete("/:id", (req, res) => {
    const users = usersUtil.readUsers();
    const newUsers = users.filter((u) => u.id !== parseInt(req.params.id));

    if (users.length === newUsers.length) {
        return res.status(404).json({ error: "User not found" });
    }

    usersUtil.writeUsers(newUsers);
    res.json({ message: "User deleted successfully" });
});

module.exports = router;