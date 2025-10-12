const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

// Momorio's note
// This will confirm and cut stock

module.exports = (pool) => {
    const router = require('express').Router();

    router.post('/', validateApiKey, async (req, res) => {
        try {
            const order_id = req.body.order_id;

            const [rows] = await pool.query(`
                    UPDATE C_ORDER
                    SET c_order_state = 'completed'
                    WHERE c_order_id = ?;
                `,
                [order_id]
            );

            if (rows.length === 0) {
                return res.status(404).json({ message: 'failed mark delivered' });
            }

            res.status(201).json({ message: 'mark restaurant order as delivered successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    return router;
};

