const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

/**
 * Get products for restaurant orders endpoint
 * Retrieves grade 2 products with image URLs for restaurant sales
 * @param {Object} pool - MySQL connection pool
 * @returns {Object} Express router
 */
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

            // Construct full image URLs for frontend consumption
            const host = req.get('host');
            const protocol = req.protocol;
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