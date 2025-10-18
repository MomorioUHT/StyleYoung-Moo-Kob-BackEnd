const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

/**
 * Get all customer orders endpoint
 * Retrieves customer orders joined with customer information
 * @param {Object} pool - MySQL connection pool
 * @returns {Object} Express router
 */
module.exports = (pool) => {
    const router = express.Router();

    router.get('/', validateApiKey, async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    o.c_order_id,
                    o.c_order_state,
                    o.c_order_date,
                    o.total_payment,
                    o.c_id,
                    o.transaction_code,
                    c.c_address,
                    c.c_firstname,
                    c.c_lastname
                FROM \`C_ORDER\` o
                JOIN \`CUSTOMER\` c ON o.c_id = c.c_id
            `);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'no any customer order found' });
            }

            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'internal server error' });
        }
    });

    return router;
};
