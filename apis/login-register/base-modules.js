module.exports = (pool) => ({
    registerCustomer: require('./register-customer')(pool),
    loginCustomer: require('./login-customer')(pool),
    verifyCustomer: require('./verify-customer')(pool),
});