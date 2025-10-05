const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

// Momorio's note
// This will not get the 'password' and 'token' field

module.exports = (pool) => {
    const router = express.Router();

    router.get('/', validateApiKey, async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    c_order_id,
                    c_order_state,
                    c_order_date,
                    total_payment,
                    c_id
                FROM \`C_ORDER\`
            `);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'no any customer order found' });
            }

            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'database error' });
        }
    });

    return router;
};
