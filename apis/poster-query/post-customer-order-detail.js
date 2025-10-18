const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

/**
 * Get customer order details by order ID endpoint (POST method)
 * Retrieves order details with product information for a specific order
 * @param {Object} pool - MySQL connection pool
 * @returns {Object} Express router
 */
module.exports = (pool) => {
    const router = require('express').Router();

    router.post('/', validateApiKey, async (req, res) => {
        try {
            const current_order_id = req.body.order_id;

            const [rows] = await pool.query(
                `SELECT 
                    od.order_detail_id,
                    od.quantity,
                    od.sub_total,
                    od.c_order_id,
                    od.p_id,
                    p.p_name
                 FROM ORDER_DETAIL od
                 JOIN PRODUCT p ON od.p_id = p.p_id
                 WHERE od.c_order_id = ?`,
                [current_order_id]
            );

            if (rows.length === 0) {
                return res.status(404).json({ message: 'That customer does not have any order' });
            }

            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    return router;
};

