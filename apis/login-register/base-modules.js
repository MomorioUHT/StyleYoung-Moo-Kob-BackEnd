module.exports = (pool) => ({
    registerCustomer: require('./register-customer')(pool),
    loginCustomer: require('./login-customer')(pool),
    verifyUser: require('./verify-user')(pool),
});