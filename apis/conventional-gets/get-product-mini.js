const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

// Momorio's note
// Mini version does not get the 'p_grade' and 'p_price' field

module.exports = (pool) => {
    const router = express.Router();

    router.get('/', validateApiKey, async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    p_id, 
                    p_name, 
                    p_quantity 
                FROM PRODUCT
            `);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'no any product found' });
            }

            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'database error' });
        }
    });

    return router;
};
