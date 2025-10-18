const express = require('express');
const bcrypt = require('bcrypt');
const validateApiKey = require('../../middleware/validate-api-key');
const generate = require('../../middleware/random-id');

const SALT_ROUNDS = 12;

/**
 * Staff registration endpoint
 * Creates a new staff account with hashed password
 * @param {Object} pool - MySQL connection pool
 * @returns {Object} Express router
 */
module.exports = (pool) => {
    const router = express.Router();

    router.post('/', validateApiKey, async (req, res) => {
        try {
            const firstname = req.body.firstname;
            const lastname = req.body.lastname;
            const phone = req.body.phone;
            const position = req.body.position;
            const username = req.body.username;
            const password = req.body.password;

            // Check for duplicate username
            const [rows] = await pool.query(
                `SELECT s_username FROM STAFF WHERE s_username = ?`, 
                [username]
            );
            
            if (rows.length > 0) {
                return res.status(409).json({ message: 'this username already exists' });
            }

            // Hash password using bcrypt
            const hashed_pw = await bcrypt.hash(password, SALT_ROUNDS);
            
            // Generate unique ID for new staff member
            const random_id = generate();
            
            // Insert new staff record into database
            const [result] = await pool.query(
                `INSERT INTO STAFF (s_id, s_firstname, s_lastname, s_tel, s_position, s_username, s_password, s_token, s_lastlogin)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [random_id, firstname, lastname, phone, position, username, hashed_pw, null, null]
            );

            res.status(201).json({ message: 'staff account created successfully' });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'internal server error' });
        }
    });

    return router;
};
