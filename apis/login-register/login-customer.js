const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const validateApiKey = require('../../middleware/validate-api-key');

const JWT_EXPIRES_IN = '1h';
const JWT_SECRET = process.env.JWT_SECRET

module.exports = (pool) => {
    const router = express.Router();

    router.post('/', validateApiKey, async (req, res) => {
        try {
            const username = req.body.username;
            const password = req.body.password;

            // Check if username exists
            const [rows] = await pool.query(`SELECT c_id, c_username, c_password FROM CUSTOMER WHERE c_username = ?`, [username]);
            if (rows.length === 0) {
                return res.status(401).json({ error: 'username or password is incorrect' });
            }

            // Check if password matches
            const user = rows[0];
            const match = await bcrypt.compare(password, user.c_password);
            if (!match) {
                return res.status(401).json({ error: 'username or password is incorrect' });
            }

            // Creates JWT Secrets
            const payload = { sub: user.c_id, username: user.c_username };
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

            // Save token and Login date to DB
            const [result] = await pool.query(`
                    UPDATE CUSTOMER
                    SET c_token = ?, c_lastlogin = NOW()
                    WHERE c_id = ?
                `,
                [token, user.c_id]
            );

            return res.json({ message: 'login successful', token: token });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'internal server error' });
        }
    });

    return router;
};
