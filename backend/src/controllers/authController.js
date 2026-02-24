const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { name, email, password, role_id } = req.body;

        const hashed = await bcrypt.hash(password, 10);

        await db.query(
            "INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)",
            [name, email, hashed, role_id]
        );

        res.json({ message: "User created successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [users] = await db.query(`
            SELECT users.*, roles.name AS role_name
            FROM users
            JOIN roles ON users.role_id = roles.id
            WHERE email = ?
        `, [email]);

        if (!users.length)
            return res.status(400).json({ message: "User not found" });

        const user = users[0];

        const valid = await bcrypt.compare(password, user.password);
        if (!valid)
            return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role_name
            },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};