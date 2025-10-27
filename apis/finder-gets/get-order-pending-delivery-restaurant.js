const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

/**
 * Get restaurant orders pending delivery endpoint
 * Retrieves restaurant orders with 'pending_delivery' status
 * @param {Object} pool - MySQL connection pool
 * @returns {Object} Express router
 */
module.exports = (pool) => {
    const router = express.Router();

    router.get('/', validateApiKey, async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    o.r_order_id, 
                    o.r_order_state, 
                    o.r_order_date,
                    o.quantity,
                    o.r_total_payment,
                    o.r_id,
                    o.s_id,
                    o.p_id,
                    r.r_name,
                    r.r_address,
                    p.p_name
                FROM \`R_ORDER\` o
                JOIN \`RESTAURANT\` r ON o.r_id = r.r_id
                JOIN \`PRODUCT\` p ON o.p_id = p.p_id
                WHERE o.r_order_state = 'pending_delivery'
            `);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'no any restaurant order found' });
            }

            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'internal server error' });
        }
    });

    return router;
};
