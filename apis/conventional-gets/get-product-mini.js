const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

/**
 * Get all products (minimal info) endpoint
 * Retrieves basic product information excluding price and grade
 * @param {Object} pool - MySQL connection pool
 * @returns {Object} Express router
 */
module.exports = (pool) => {
    const router = express.Router();

    router.get('/', validateApiKey, async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    p_id, 
                    p_name, 
                    p_quantity 
                FROM PRODUCT
            `);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'no any product found' });
            }

            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'internal server error' });
        }
    });

    return router;
};
