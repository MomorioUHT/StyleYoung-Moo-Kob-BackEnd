const express = require('express');
const bcrypt = require('bcrypt');

const validateApiKey = require('../../middleware/validate-api-key');
const randomID = require('../../middleware/random-id');

const SALT_ROUNDS = 12;

module.exports = (pool) => {
    const router = express.Router();

    router.post('/', validateApiKey, async (req, res) => {
        try {
            const firstname = req.body.firstname;
            const lastname = req.body.lastname;
            const tel = req.body.tel;
            const address = req.body.address;
            const username = req.body.username;
            const password = req.body.password;

            // Generate an id for that username
            const random_id = randomID();

            // Check if any duplicates username
            const [rows] = await pool.query(`SELECT c_username FROM CUSTOMER WHERE c_username = ?`, [username]);
            if (rows.length > 0) {
                res.status(409).json({ message: 'this username already exists'})
            }

            // Hash password
            const hashed_pw = await bcrypt.hash(password ,SALT_ROUNDS)

            // Save to database
            const [result] = await pool.query(`
                INSERT INTO CUSTOMER (c_id, c_firstname, c_lastname, c_tel, c_address, c_username, c_password, c_token, c_lastlogin)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [random_id, firstname, lastname, tel, address, username, hashed_pw, null, null]
            );

            res.status(201).json({ message: 'customer account created successfully'})

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'internal server error' });
        }
    });

    return router;
};
