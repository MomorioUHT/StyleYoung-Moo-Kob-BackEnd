const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

/**
 * Get customer orders pending delivery endpoint
 * Retrieves customer orders with 'pending_delivery' status
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
                    c.c_firstname,
                    c.c_lastname
                FROM C_ORDER o
                JOIN CUSTOMER c ON o.c_id = c.c_id
                WHERE o.c_order_state = 'pending_delivery'
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
