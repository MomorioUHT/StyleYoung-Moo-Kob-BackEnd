const express = require('express');

const validateApiKey = require('../../middleware/validate-api-key');
const randomID = require('../../middleware/random-id');

module.exports = (pool) => {
    const router = express.Router();

    router.post('/', validateApiKey, async (req, res) => {
        try {
            const product_name = req.body.product_name;
            const product_price = parseFloat(req.body.product_price);
            const product_weight = parseFloat(req.body.product_weight);

            // Check if any duplicate product name
            const [rows] = await pool.query(`SELECT p_name FROM PRODUCT WHERE p_name = ?`, [product_name]);
            if (rows.length > 0) {
                return res.status(409).json({ message: 'this product already exists'})
            }

            // Generate an id for that product
            const random_id = randomID();

            // Save to database
            const [result] = await pool.query(`
                INSERT INTO PRODUCT (p_id, p_name, p_price, p_grade, p_weight, p_quantity)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [random_id, product_name, product_price, 1, product_weight, 0]
            );

            res.status(201).json({ message: 'product register successfully'})

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'internal server error' });
        }
    });

    return router;
};
