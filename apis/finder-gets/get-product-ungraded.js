const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

// Momorio's note
// only ungraded (0) and p_quantity of products will return

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
                WHERE p_grade = '0'
            `);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'no any ungraded product' });
            }

            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'database error' });
        }
    });

    return router;
};
