const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

module.exports = (pool) => {
    const router = express.Router();

    router.get('/', validateApiKey, async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    JSON_OBJECT(
                        'p_id', p.p_id,
                        'p_name', p.p_name,
                        'ingredients', JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'i_id', i.i_id,
                                'i_name', i.i_name,
                                'ingre_use_amount', r.ingre_use_amount
                            )
                        )
                    ) AS product_recipe
                FROM PRODUCT p
                JOIN RECIPE r ON p.p_id = r.p_id
                JOIN INGREDIENT i ON r.i_id = i.i_id
                GROUP BY p.p_id, p.p_name;
            `);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'no any recipe found' });
            }

            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'internal server error' });
        }
    });

    return router;
};
