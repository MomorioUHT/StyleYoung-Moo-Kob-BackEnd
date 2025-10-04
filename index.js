require('dotenv').config();

const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const PORT = process.env.PORT;

app.use(express.json());

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Database connected successfully');
        connection.release();
    } catch (err) {
        console.error('Unable to connect to the database:', err.message);
        process.exit(1);
    }
})();

const API1 = require('./API/API1');
app.use('/api1', API1(pool));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
