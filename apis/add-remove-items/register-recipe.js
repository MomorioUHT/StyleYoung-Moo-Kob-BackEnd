const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');

/**
 * Register recipe endpoint
 * Creates recipe entries that link products with ingredients and usage amounts
 * @param {Object} pool - MySQL connection pool
 * @returns {Object} Express router
 */
module.exports = (pool) => {
    const router = express.Router();

    router.post('/', validateApiKey, async (req, res) => {
        try {
            const { p_id, ingredients } = req.body;

            // Validate request payload structure
            if (!p_id || !Array.isArray(ingredients) || ingredients.length === 0) {
                return res.status(400).json({ message: 'Invalid payload structure' });
            }

            // Prepare values for bulk insert (product_id, ingredient_id, usage_amount)
            const values = ingredients.map(ing => [p_id, ing.i_id, ing.ingre_use_amount]);
            
            // Insert multiple recipe entries at once
            await pool.query(
                `INSERT INTO RECIPE (p_id, i_id, ingre_use_amount) VALUES ?`,
                [values]
            );

            res.status(201).json({ message: 'recipe created successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    return router;
};
