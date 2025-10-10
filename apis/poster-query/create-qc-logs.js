const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');
const generate = require('../../middleware/random-id');

// Momorio's Note
// create QC per 1 kg

module.exports = (pool) => {
    const router = express.Router();

    router.post('/', validateApiKey, async (req, res) => {
        try {
            const staff_id = req.body.staff_id;
            const product_id = req.body.product_id;
            const qc_grade = req.body.qc_grade;
            const qc_quantity = req.body.qc_quantity;

            // Generate an id for that qc log
            const random_id = generate();

            // Create QC logs
            await pool.query(`
                INSERT INTO QC (qc_id, qc_state, qc_grade, qc_date, qc_quantity, p_id, s_id)
                VALUES (?, ?, ?, NOW(), ?, ?, ?);
            `, [random_id, 'to_be_added', qc_grade, qc_quantity, product_id, staff_id])

            // Update Grade 0 remove by qc_quantity
            await pool.query(
                `
                UPDATE PRODUCT
                SET p_quantity = p_quantity - ?
                WHERE p_id = ?
                `,
                [qc_quantity, product_id]
            )

            res.status(201).json({ message: 'qc log create successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    return router;
};
