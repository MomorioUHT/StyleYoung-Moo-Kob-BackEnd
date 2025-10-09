const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

module.exports = (pool) => {
    const router = express.Router();

    router.get('/', validateApiKey, async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    pl.prod_id,
                    pl.prod_date,
                    pl.prod_quantity,
                    pl.p_id,
                    p.p_name
                FROM PROD_LOG pl
                JOIN PRODUCT p ON pl.p_id = p.p_id
            `);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'no any production logs found' });
            }

            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'internal server error' });
        }
    });

    return router;
};
