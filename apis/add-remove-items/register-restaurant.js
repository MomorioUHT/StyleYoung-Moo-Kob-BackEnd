const express = require('express');

const validateApiKey = require('../../middleware/validate-api-key');
const randomID = require('../../middleware/random-id');

module.exports = (pool) => {
    const router = express.Router();

    router.post('/', validateApiKey, async (req, res) => {
        try {
            const restaurant_name = req.body.restaurant_name;
            const restaurant_tel = req.body.restaurant_tel;
            const restaurant_address = req.body.restaurant_address;

            // Check if any duplicate restaurant name
            const [rows] = await pool.query(`SELECT r_name FROM RESTAURANT WHERE r_name = ?`, [restaurant_name]);
            if (rows.length > 0) {
                return res.status(409).json({ message: 'this restaurant already exists'})
            }

            // Generate an id for that restaurant
            const random_id = randomID();

            // Save to database
            const [result] = await pool.query(`
                INSERT INTO RESTAURANT (r_id, r_name, r_tel, r_address)
                VALUES (?, ?, ?, ?)`,
                [random_id, restaurant_name, restaurant_tel, restaurant_address]
            );

            res.status(201).json({ message: 'restaurant register successfully'})

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'internal server error' });
        }
    });

    return router;
};
