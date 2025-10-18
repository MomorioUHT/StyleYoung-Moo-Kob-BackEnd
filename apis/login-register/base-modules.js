/**
 * Base module for authentication operations
 * Exports all login, registration, and verification endpoints
 * @param {Object} pool - MySQL connection pool
 * @returns {Object} Object containing all authentication route handlers
 */
module.exports = (pool) => ({
    registerCustomer: require('./register-customer')(pool),
    registerStaff: require('./register-staff')(pool),
    loginCustomer: require('./login-customer')(pool),
    loginStaff: require('./login-staff')(pool),
    verifyUser: require('./verify-user')(pool),
});