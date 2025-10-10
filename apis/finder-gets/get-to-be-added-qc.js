const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

// Momorio's note
// only ungraded (0) and non-existant in RECIPE of products will return

module.exports = (pool) => {
    const router = express.Router();

    router.get('/', validateApiKey, async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    QC.qc_id,
                    QC.p_id,
                    QC.qc_grade,
                    QC.qc_quantity,
                    QC.qc_date,
                    PRODUCT.p_name,
                    PRODUCT.p_weight
                FROM QC
                JOIN PRODUCT ON QC.p_id = PRODUCT.p_id
                WHERE QC.qc_state = 'to_be_added';
            `);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'no product wait for add' });
            }

            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'internal server error' });
        }
    });

    return router;
};
