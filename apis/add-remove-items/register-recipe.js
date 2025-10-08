const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

module.exports = (pool) => {
    const router = express.Router();

    router.post('/', validateApiKey, async (req, res) => {
        try {
            const { p_id, ingredients } = req.body;

            if (!p_id || !Array.isArray(ingredients) || ingredients.length === 0) {
                return res.status(400).json({ message: 'Invalid payload structure' });
            }

            // Insert Multiple Rows
            const values = ingredients.map(ing => [p_id, ing.i_id, ing.ingre_use_amount]);
            await pool.query(
                `INSERT INTO RECIPE (p_id, i_id, ingre_use_amount) VALUES ?`,
                [values]
            );

            res.status(201).json({ message: 'Recipe created successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    return router;
};
