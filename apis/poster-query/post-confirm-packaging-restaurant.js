const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

/**
 * Confirm restaurant order packaging endpoint
 * Updates restaurant order status to 'pending_delivery'
 * @param {Object} pool - MySQL connection pool
 * @returns {Object} Express router
 */
module.exports = (pool) => {
    const router = require('express').Router();

    router.post('/', validateApiKey, async (req, res) => {
        try {
            const order_id = req.body.r_order_id;

            const [rows] = await pool.query(
                `UPDATE R_ORDER
                 SET r_order_state = 'pending_delivery'
                 WHERE r_order_id = ?;`,
                [order_id]
            );
            
            if (rows.length === 0) {
                return res.status(404).json({ message: 'failed to update packaging status' });
            }

            res.status(201).json({ message: 'packaging status update successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    return router;
};

