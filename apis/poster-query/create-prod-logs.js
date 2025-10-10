const express = require('express');
const validateApiKey = require('../../middleware/validate-api-key');
const generate = require('../../middleware/random-id');

// Momorio's Note
// Making the Production Logs and Deduct the ingredient amounts

module.exports = (pool) => {
    const router = express.Router();

    router.post('/', validateApiKey, async (req, res) => {
        try {
            const { product_id, produce_quantity, ingredients } = req.body;

            if (!product_id || !Array.isArray(ingredients) || ingredients.length === 0) {
                return res.status(400).json({ message: 'Invalid payload structure' });
            }
            // Generate an id for that log
            const random_id = generate();

            // Create Prod Log
            await pool.query(`
                INSERT INTO PROD_LOG (prod_id, prod_date, prod_quantity, p_id)
                VALUES (?, NOW(), ?, ?);
            `, [random_id, produce_quantity, product_id])

            // Remove Ingredients use amount by the use amount per id
            for (const ing of ingredients) {
                await pool.query(
                    `UPDATE INGREDIENT
                    SET i_amount = i_amount - ?
                    WHERE i_id = ?`,
                    [ing.ingre_use_amount, ing.i_id]
                );
            }

            // Update Grade 0
            await pool.query(
                `
                UPDATE PRODUCT
                SET p_quantity = p_quantity + ?
                WHERE p_id = ?
                `,
                [produce_quantity, product_id]
            )

            res.status(201).json({ message: 'production log create successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    return router;
};
