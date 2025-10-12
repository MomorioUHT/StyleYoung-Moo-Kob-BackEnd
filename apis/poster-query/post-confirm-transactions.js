const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

// Momorio's note
// This will confirm and cut stock

module.exports = (pool) => {
    const router = require('express').Router();

    router.post('/', validateApiKey, async (req, res) => {
        try {
            const { customer_id, order_id, order_detail } = req.body;

            const [rows] = await pool.query(`
                    UPDATE C_ORDER
                    SET c_order_state = 'wait_for_packaging'
                    WHERE c_id = ? AND c_order_id = ?;
                `,
                [customer_id, order_id]
            );
            
            // Loop ตัดของออกจาก Stock
            if (Array.isArray(order_detail)) {
                for (const item of order_detail) {
                    const { p_id, p_quantity } = item;

                    await pool.query(
                        `UPDATE PRODUCT 
                        SET p_quantity = p_quantity - ?
                        WHERE p_id = ?;`,
                        [p_quantity, p_id]
                    );
                }
            }

            if (rows.length === 0) {
                return res.status(404).json({ message: 'failed to confirm transaction status' });
            }

            res.status(201).json({ message: 'tranactions rejected and order confirmed successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    return router;
};

