const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

// Momorio's note
// This will confirm and cut stock

module.exports = (pool) => {
    const router = require('express').Router();

    router.post('/', validateApiKey, async (req, res) => {
        try {
            const restaurant_id = req.body.restaurant_id;
            const restaurant_order_id = req.body.restaurant_order_id;
            const order_quantity = req.body.order_quantity;
            const product_id = req.body.product_id;

            const [rows] = await pool.query(`
                    UPDATE R_ORDER
                    SET r_order_state = 'wait_for_packaging'
                    WHERE r_id = ? AND r_order_id = ?;
                `,
                [restaurant_id, restaurant_order_id]
            );
            
            await pool.query(
                `UPDATE PRODUCT 
                SET p_quantity = p_quantity - ?
                WHERE p_id = ?;`,
                [order_quantity, product_id]
            );

            if (rows.length === 0) {
                return res.status(404).json({ message: 'failed to confirm transaction status' });
            }

            console.log(rows)
            res.status(201).json({ message: 'tranactions accepted and order confirmed successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    return router;
};

