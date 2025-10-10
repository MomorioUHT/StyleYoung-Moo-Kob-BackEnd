const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

module.exports = (pool) => {
    const router = express.Router();

    router.post('/', validateApiKey, async (req, res) => {
        try {
            const quantity = req.body.target_quantity;
            const qc_id = req.body.qc_id;
            const result_p_id = req.body.result_p_id;

            console.log(req.body)
            await pool.query(
                `UPDATE QC
                SET qc_state = 'added'
                WHERE qc_id = ?;
                `, [qc_id]
            );

            await pool.query(
                `UPDATE PRODUCT
                SET p_quantity = p_quantity + ?
                WHERE p_id = ?;
                `, [quantity, result_p_id]
            );

            res.json({ message: 'product accepted successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Database error' });
        }
    });

    return router;
};