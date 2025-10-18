const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');
const generate = require('../../middleware/random-id');

/**
 * Create customer order endpoint
 * Creates order and nested order details in a single transaction
 * @param {Object} pool - MySQL connection pool
 * @returns {Object} Express router
 */
module.exports = (pool) => {
    const router = express.Router();

    router.post('/', validateApiKey, async (req, res) => {
        try {
            const { customer_id, total_payment, transaction_code, orderDetails } = req.body;
            console.log(req.body);

            // Generate unique order ID
            const order_id = generate();

            // Insert main order record
            await pool.query(
                `INSERT INTO C_ORDER
                 (c_order_id, c_order_state, c_order_date, total_payment, transaction_code, c_id)
                 VALUES (?, ?, NOW(), ?, ?, ?)`,
                [order_id, 'wait_for_check', total_payment, transaction_code, customer_id]
            );

            // Insert all order detail records
            for (const item of orderDetails) {
                const order_detail_id = generate();

                await pool.query(
                    `INSERT INTO ORDER_DETAIL
                     (order_detail_id, quantity, sub_total, c_order_id, p_id)
                     VALUES (?, ?, ?, ?, ?)`,
                    [order_detail_id, item.quantity, item.sub_total, order_id, item.p_id]
                );
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
