const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

module.exports = (pool) => {
    const router = express.Router();

    router.get('/', validateApiKey, async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    r_order_id, 
                    r_order_state, 
                    quantity,
                    r_total_payment,
                    r_id,
                    s_id,
                    p_id
                FROM \`R_ORDER\`
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
