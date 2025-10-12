const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

// Momorio's note
// get second grade products

module.exports = (pool) => {
    const router = express.Router();

    router.get('/', validateApiKey, async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT p_id, p_name, p_price, p_quantity
                FROM PRODUCT 
                WHERE p_grade = 2;
            `);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'no any second grade products' });
            }

            // Create a URL For frontend
            const host = req.get('host'); // Get the host base URL
            const protocol = req.protocol; // http or https
            const productsWithUrl = rows.map(p => ({
                ...p,
                picture_url: p.p_picture ? `${protocol}://${host}/uploads/products/${p.p_picture}` : null
            }));

            res.json(productsWithUrl);

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'internal server error' });
        }
    });

    return router;
};