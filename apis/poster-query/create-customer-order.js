const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');
const generate = require('../../middleware/random-id');

// Momorio's Note
// This will create order and order detail based on that order id (nested)

module.exports = (pool) => {
    const router = express.Router();

    router.post('/', validateApiKey, async (req, res) => {
        try {
            const { customer_id, total_payment, orderDetails } = req.body;

            const order_id = generate();

            await pool.query(`
                INSERT INTO C_ORDER
                (c_order_id, c_order_state, c_order_date, total_payment, c_id)
                VALUES (?, ?, NOW(), ?, ?)
            `, [order_id, 'pending_payment', total_payment, customer_id]);

            for (const item of orderDetails) {
                const order_detail_id = generate();

                await pool.query(`
                    INSERT INTO ORDER_DETAIL
                    (order_detail_id, quantity, sub_total, c_order_id, p_id)
                    VALUES (?, ?, ?, ?, ?)
                `, [order_detail_id, item.quantity, item.sub_total, order_id, item.p_id]);
            }

            res.status(201).json({
                message: 'order and details created successfully',
                order_id
            });

        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    return router;
};
