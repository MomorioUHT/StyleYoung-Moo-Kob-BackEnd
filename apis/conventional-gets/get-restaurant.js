const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

module.exports = (pool) => {
    const router = express.Router();

    router.get('/', validateApiKey, async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    r_id, 
                    r_name, 
                    r_tel, 
                    r_address
                FROM RESTAURANT
            `);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'no any restaurant found' });
            }

            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'database error' });
        }
    });

    return router;
};
