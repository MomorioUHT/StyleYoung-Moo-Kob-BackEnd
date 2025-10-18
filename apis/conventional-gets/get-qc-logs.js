const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

/**
 * Get all quality control logs endpoint
 * Retrieves QC log entries joined with staff and product information
 * @param {Object} pool - MySQL connection pool
 * @returns {Object} Express router
 */
module.exports = (pool) => {
    const router = express.Router();

    router.get('/', validateApiKey, async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    qc.qc_id,
                    qc.qc_state,
                    qc.qc_date,
                    qc.qc_quantity,
                    qc.qc_grade,
                    qc.p_id,
                    qc.s_id,
                    s.s_firstname,
                    s.s_lastname,
                    p.p_name
                FROM QC AS qc
                JOIN STAFF AS s ON qc.s_id = s.s_id
                JOIN PRODUCT AS p ON qc.p_id = p.p_id;
            `);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'no any qc logs found' });
            }

            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'internal server error' });
        }
    });

    return router;
};
