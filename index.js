require('dotenv').config();

const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const path = require('path');
const PORT = process.env.PORT;

const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use('/uploads/products', express.static(path.join(__dirname, 'uploads/products')));

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

// Conventional Gets
const conventionalGets = require('./apis/conventional-gets/base-modules');
const routes = conventionalGets(pool);

console.log(`Loading Conventional Gets...`);
for (const [key, router] of Object.entries(routes)) {
    app.use(`/${key}`, router);
    console.log(`* Loaded route: /${key}`);
}

// Finder Gets
console.log("==========")
const finderGets = require('./apis/finder-gets/base-modules');
const routes2 = finderGets(pool);

console.log(`Loading Finder Gets...`);
for (const [key, router] of Object.entries(routes2)) {
    app.use(`/${key}`, router);
    console.log(`* Loaded route: /${key}`);
}

// Poster Query
console.log("==========")
const posterQuery = require('./apis/poster-query/base-modules');
const routes3 = posterQuery(pool);

console.log(`Loading Poster Query...`);
for (const [key, router] of Object.entries(routes3)) {
    app.use(`/${key}`, router);
    console.log(`* Loaded route: /${key}`);
}

// Login & Register
console.log("==========")
const loginRegister = require('./apis/login-register/base-modules');
const routes4 = loginRegister(pool);

console.log(`Loading login Register...`);
for (const [key, router] of Object.entries(routes4)) {
    app.use(`/${key}`, router);
    console.log(`* Loaded route: /${key}`);
}

// add-remove items
console.log("==========")
const addRemoveItems = require('./apis/add-remove-items/base-modules');
const routes5 = addRemoveItems(pool);

console.log(`Loading Add/Remove items...`);
for (const [key, router] of Object.entries(routes5)) {
    app.use(`/${key}`, router);
    console.log(`* Loaded route: /${key}`);
}

console.log("==========")
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
