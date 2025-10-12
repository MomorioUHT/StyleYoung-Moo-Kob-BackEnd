const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

// Momorio's note
// this will return the customer's product based on their ID
// this is POST

module.exports = (pool) => {
    const router = express.Router();

    router.post('/', validateApiKey, async (req, res) => {
        try {
            const customer_id = req.body.customer_id;

            const [rows] = await pool.query(`
                SELECT c_order_id, c_order_state, c_order_date, total_payment, transaction_code
                FROM C_ORDER
                WHERE c_id = ?
            `, [customer_id]);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'that customer does not have any order' });
            }

            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'internal server error' });
        }
    });

    return router;
};
