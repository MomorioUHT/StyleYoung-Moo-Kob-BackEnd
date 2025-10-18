const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');
const generate = require('../../middleware/random-id');

/**
 * Create QC (Quality Control) logs endpoint
 * Creates QC records and deducts from grade 0 product quantity
 * @param {Object} pool - MySQL connection pool
 * @returns {Object} Express router
 */
module.exports = (pool) => {
    const router = express.Router();

    router.post('/', validateApiKey, async (req, res) => {
        try {
            const staff_id = req.body.staff_id;
            const product_id = req.body.product_id;
            const qc_grade = req.body.qc_grade;
            const qc_quantity = req.body.qc_quantity;

            // Generate unique ID for QC log
            const random_id = generate();

            // Create QC log with 'to_be_added' status
            await pool.query(
                `INSERT INTO QC (qc_id, qc_state, qc_grade, qc_date, qc_quantity, p_id, s_id)
                 VALUES (?, ?, ?, NOW(), ?, ?, ?);`,
                [random_id, 'to_be_added', qc_grade, qc_quantity, product_id, staff_id]
            );

            // Deduct QC quantity from grade 0 product
            await pool.query(
                `UPDATE PRODUCT
                 SET p_quantity = p_quantity - ?
                 WHERE p_id = ?`,
                [qc_quantity, product_id]
            );

            res.status(201).json({ message: 'qc log create successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    return router;
};
