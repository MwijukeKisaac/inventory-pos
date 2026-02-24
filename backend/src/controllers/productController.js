const db = require("../config/db");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, quantity, cost_price } = req.body;

        const qrToken = uuidv4();

        const [result] = await db.query(`
            INSERT INTO products 
            (name, description, price, quantity, cost_price, created_by, qr_code)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            name,
            description,
            price,
            quantity,
            cost_price,
            req.user.id,
            qrToken
        ]);

        const qrUrl = `http://localhost:5000/api/qr/product/${qrToken}`;

        await QRCode.toFile(`./qrcodes/product-${result.insertId}.png`, qrUrl);

        res.json({
            message: "Product created with QR",
            qrUrl
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProducts = async (req, res) => {
    const [products] = await db.query(`
        SELECT * FROM products
    `);
    res.json(products);
};

exports.updateStock = async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    await db.query(
        "UPDATE products SET quantity = ? WHERE id = ?",
        [quantity, id]
    );

    // check low-stock threshold and notify managers
    try {
        const [rows] = await db.query(
            "SELECT name, low_stock_threshold FROM products WHERE id = ?",
            [id]
        );
        const product = rows[0];
        if (product) {
            const threshold = product.low_stock_threshold || 0;
            if (quantity <= threshold && req.io) {
                req.io.to("Manager").emit("lowStock", {
                    productName: product.name,
                    remaining: quantity
                });
            }
        }
    } catch (err) {
        console.warn("Low stock check failed:", err.message);
    }

    res.json({ message: "Stock updated" });
};