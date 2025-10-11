const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

// Momorio's note
// This is from the confirm button 'pending_payment' -> 'cancelled'

module.exports = (pool) => {
    const router = require('express').Router();

    router.post('/', validateApiKey, async (req, res) => {
        try {
            const customer_id = req.body.customer_id;
            const current_order_id = req.body.order_id;

            const [rows] = await pool.query(`
                    UPDATE C_ORDER
                    SET c_order_state = 'cancelled'
                    WHERE c_id = ? AND c_order_id = ?;
                `,
                [customer_id, current_order_id]
            );

            if (rows.length === 0) {
                return res.status(404).json({ message: 'failed to confirm transaction status' });
            }

            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    return router;
};

