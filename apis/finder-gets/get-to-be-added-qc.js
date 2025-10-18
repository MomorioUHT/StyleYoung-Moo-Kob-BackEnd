const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

/**
 * Get products pending QC addition endpoint
 * Retrieves QC entries with 'to_be_added' status joined with product details
 * @param {Object} pool - MySQL connection pool
 * @returns {Object} Express router
 */
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
