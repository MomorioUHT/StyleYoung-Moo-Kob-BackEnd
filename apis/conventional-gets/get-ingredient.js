const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

module.exports = (pool) => {
    const router = express.Router();

    router.get('/', validateApiKey, async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    i_id, 
                    i_name,
                    i_amount
                FROM INGREDIENT
            `);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'no any ingredients found' });
            }

            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'database error' });
        }
    });

    return router;
};
