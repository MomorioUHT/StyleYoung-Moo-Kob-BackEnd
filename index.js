require('dotenv').config();

const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;

// Middleware configuration
app.use(cors());
app.use(express.json());
app.use('/uploads/products', express.static(path.join(__dirname, 'uploads/products')));

// Database connection pool configuration
const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

/**
 * Test database connection on startup
 * Exits the process if connection fails
 */
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

/**
 * Load and register route modules
 * @param {Object} routeModule - The module containing routes
 * @param {string} moduleName - Name of the module for logging
 */
function loadRoutes(routeModule, moduleName) {
    const routes = routeModule(pool);
    
    console.log(`Loading ${moduleName}...`);
    for (const [key, router] of Object.entries(routes)) {
        app.use(`/${key}`, router);
        console.log(`* Loaded route: /${key}`);
    }
    console.log('==========');
}

// Load all API route modules
const conventionalGets = require('./apis/conventional-gets/base-modules');
loadRoutes(conventionalGets, 'Conventional Gets');

const finderGets = require('./apis/finder-gets/base-modules');
loadRoutes(finderGets, 'Finder Gets');

const posterQuery = require('./apis/poster-query/base-modules');
loadRoutes(posterQuery, 'Poster Query');

const loginRegister = require('./apis/login-register/base-modules');
loadRoutes(loginRegister, 'Login Register');

const addRemoveItems = require('./apis/add-remove-items/base-modules');
loadRoutes(addRemoveItems, 'Add/Remove Items');

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
