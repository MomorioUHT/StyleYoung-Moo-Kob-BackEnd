const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

// Momorio's note
// this will return the customer's product detail based on the selected c_order_id
// This is POST

module.exports = (pool) => {
    const router = require('express').Router();

    router.post('/', validateApiKey, async (req, res) => {
        try {
            const current_order_id = req.body.order_id;

            const [rows] = await pool.query(
                `
                SELECT 
                    od.order_detail_id,
                    od.quantity,
                    od.sub_total,
                    od.c_order_id,
                    od.p_id,
                    p.p_name
                FROM ORDER_DETAIL od
                JOIN PRODUCT p ON od.p_id = p.p_id
                WHERE od.c_order_id = ?
                `,
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

