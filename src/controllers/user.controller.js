const { usersUtil } = require('../config/app.config');

const UserController = {
    getAllUsers: (req, res) => {
        try {
            const users = usersUtil.readUsers();
            const safeUsers = users.map(({ id, name, email }) => ({ id, name, email }));
            res.status(200).json(safeUsers);
        } catch (error) {
            res.status(500).json({ error: 'Error getting users' });
        }
    },

    getUserById: (req, res) => {
        try {
            const users = usersUtil.readUsers();
            const user = users.find(u => u.id === parseInt(req.params.id));
            
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const { password, ...safeUser } = user;
            res.status(200).json(safeUser);
        } catch (error) {
            res.status(500).json({ error: 'Error getting user' });
        }
    },

    updateUser: (req, res) => {
        try {
            const users = usersUtil.readUsers();
            const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
            
            if (userIndex === -1) {
                return res.status(404).json({ error: 'User not found' });
            }

            const { name, email } = req.body;
            
            if (name) users[userIndex].name = name;
            if (email) users[userIndex].email = email;

            usersUtil.writeUsers(users);
            
            const { password, ...updatedUser } = users[userIndex];
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({ error: 'Error updating user' });
        }
    },

    deleteUser: (req, res) => {
        try {
            const users = usersUtil.readUsers();
            const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
            
            if (userIndex === -1) {
                return res.status(404).json({ error: 'User not found' });
            }

            users.splice(userIndex, 1);
            usersUtil.writeUsers(users);
            
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting user' });
        }
    }
};

module.exports = UserController;