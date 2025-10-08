const express = require('express');

const validateApiKey = require('../../middleware/validate-api-key');
const randomID = require('../../middleware/random-id');

module.exports = (pool) => {
    const router = express.Router();

    router.post('/', validateApiKey, async (req, res) => {
        try {
            const ingredient_name = req.body.ingredient_name;

            // Check if any duplicate ingredient name
            const [rows] = await pool.query(`SELECT i_name FROM INGREDIENT WHERE i_name = ?`, [ingredient_name]);
            if (rows.length > 0) {
                return res.status(409).json({ message: 'this ingredient already exists'})
            }

            // Generate an id for that ingredient
            const random_id = randomID();

            // Save to database
            const [result] = await pool.query(`
                INSERT INTO INGREDIENT (i_id, i_name, i_amount)
                VALUES (?, ?, ?)`,
                [random_id, ingredient_name, 0]
            );

            res.status(201).json({ message: 'ingredient register successfully'})

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'internal server error' });
        }
    });

    return router;
};
