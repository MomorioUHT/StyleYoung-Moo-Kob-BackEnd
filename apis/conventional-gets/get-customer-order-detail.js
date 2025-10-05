const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

// Momorio's note
// This customer's order detail, not for restaurant!

module.exports = (pool) => {
    const router = express.Router();

    router.get('/', validateApiKey, async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    order_detail_id,
                    sub_total,
                    quantity,
                    c_order_id,
                    p_id
                FROM \`ORDER_DETAL\`
            `);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'no any order detail found' });
            }

            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'database error' });
        }
    });

    return router;
};
