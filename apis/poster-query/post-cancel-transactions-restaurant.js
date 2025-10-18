const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

/**
 * Cancel restaurant transaction endpoint
 * Updates restaurant order status to 'cancelled'
 * @param {Object} pool - MySQL connection pool
 * @returns {Object} Express router
 */
module.exports = (pool) => {
    const router = require('express').Router();

    router.post('/', validateApiKey, async (req, res) => {
        try {
            const restaurant_id = req.body.restaurant_id;
            const restaurant_order_id = req.body.restaurant_order_id;

            const [rows] = await pool.query(
                `UPDATE R_ORDER
                 SET r_order_state = 'cancelled'
                 WHERE r_id = ? AND r_order_id = ?;`,
                [restaurant_id, restaurant_order_id]
            );
            
            if (rows.length === 0) {
                return res.status(404).json({ message: 'failed to confirm transaction status' });
            }

            res.status(201).json({ message: 'tranactions rejected and order cancelled successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    return router;
};

