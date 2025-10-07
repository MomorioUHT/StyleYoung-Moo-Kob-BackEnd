module.exports = (pool) => ({
    registerCustomer: require('./register-customer')(pool),
    registerStaff: require('./register-staff')(pool),
    loginCustomer: require('./login-customer')(pool),
    loginStaff: require('./login-staff')(pool),
    verifyUser: require('./verify-user')(pool),
});