const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

module.exports = (pool) => {
    const router = express.Router();

    router.get('/', validateApiKey, async (req, res) => {
        try {
            const p_id = req.body.p_id;

            const [rows] = await pool.query(
                `SELECT r.i_id, i.i_name, r.ingre_use_amount
                FROM RECIPE r
                JOIN INGREDIENT i ON r.i_id = i.i_id
                WHERE r.p_id = ?`,
                [p_id]
            );

            if (rows.length === 0) {
                res.status(404).json({ message: 'no recipe found for that product'})
            }

            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'database error' });
        }
    });

    return router;
};
