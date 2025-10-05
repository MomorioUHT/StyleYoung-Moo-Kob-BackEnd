const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

module.exports = (pool) => {
    const router = express.Router();

    router.get('/', validateApiKey, async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    qc_id,
                    qc_state,
                    qc_date,
                    qc_quantity,
                    qc_grade,
                    p_id,
                    s_id
                FROM QC
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
