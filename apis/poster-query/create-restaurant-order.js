const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');
const generate = require('../../middleware/random-id');

// Momorio's Note
// This will create restaurant's order (single order) p_id inside

module.exports = (pool) => {
    const router = express.Router();

    router.post('/', validateApiKey, async (req, res) => {
        try {
            const total_payment = req.body.total_payment;
            const quantity = req.body.quantity; 
            const staff_id = req.body.staff_id;
            const restaurant_id = req.body.restaurant_id;
            const product_id = req.body.product_id;

            // generate Order ID for r_order_id
            const order_id = generate();

            await pool.query(`
                INSERT INTO R_ORDER
                (r_order_id, r_order_state, r_order_date, r_total_payment, quantity, s_id, r_id, p_id)
                VALUES (?, ?, NOW(), ?, ?, ?, ?, ?)
            `, [order_id, 'wait_for_check', total_payment, quantity, staff_id, restaurant_id, product_id]);

            res.status(201).json({ message: 'restaurant order created successfully'});
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    return router;
};
