const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

/**
 * Get all customers endpoint
 * Retrieves customer data excluding sensitive fields (password, token)
 * @param {Object} pool - MySQL connection pool
 * @returns {Object} Express router
 */
module.exports = (pool) => {
    const router = express.Router();

    router.get('/', validateApiKey, async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    c_id,
                    c_firstname,
                    c_lastname,
                    c_tel,
                    c_address,
                    c_username,
                    c_lastlogin 
                FROM CUSTOMER
            `);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'no any customer found' });
            }

            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'internal server error' });
        }
    });

    return router;
};
