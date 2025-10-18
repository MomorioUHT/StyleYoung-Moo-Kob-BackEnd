const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

/**
 * Get all suppliers endpoint
 * Retrieves all supplier records with ID, name, telephone, and address
 * @param {Object} pool - MySQL connection pool
 * @returns {Object} Express router
 */
module.exports = (pool) => {
    const router = express.Router();

    router.get('/', validateApiKey, async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    sup_id, 
                    sup_name, 
                    sup_tel,
                    sup_address
                FROM SUPPLIER
            `);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'no any supplier found' });
            }

            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'internal server error' });
        }
    });

    return router;
};
