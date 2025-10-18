const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

/**
 * Get products with existing recipes endpoint
 * Retrieves ungraded (grade 0) products that have recipes defined
 * @param {Object} pool - MySQL connection pool
 * @returns {Object} Express router
 */
module.exports = (pool) => {
    const router = express.Router();

    router.get('/', validateApiKey, async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT p_id, p_name 
                FROM PRODUCT 
                WHERE p_id IN (SELECT p_id FROM RECIPE)
                AND p_grade = 0;
            `);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'no product with recipe' });
            }

            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'internal server error' });
        }
    });

    return router;
};
