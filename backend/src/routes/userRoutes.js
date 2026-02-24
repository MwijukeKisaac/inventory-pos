const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const db = require("../config/db");

router.get("/", auth, role("Owner"), async (req, res) => {
    const [users] = await db.query("SELECT id, name, email, role FROM users");
    res.json(users);
});

module.exports = router;