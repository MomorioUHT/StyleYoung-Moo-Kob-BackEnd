/**
 * Base module for POST/UPDATE operations
 * Exports all endpoints that create or modify data
 * @param {Object} pool - MySQL connection pool
 * @returns {Object} Object containing all POST/UPDATE route handlers
 */
module.exports = (pool) => ({
    createSupplyLogs: require('./create-supply-logs')(pool),
    createProductionLogs: require('./create-prod-logs')(pool),
    createQCLogs: require('./create-qc-logs')(pool),
    acceptProduct: require('./accept-product')(pool),
    createCustomerOrder: require('./create-customer-order')(pool),
    customerOrders: require('./post-customer-order')(pool),
    customerOrderDetails: require('./post-customer-order-detail')(pool),
    confirmTransactions: require('./post-confirm-transactions')(pool),
    cancelTransactions: require('./post-cancel-transactions')(pool),
    confirmPackaging: require('./post-confirm-packaging')(pool),
    createRestaurantOrder: require('./create-restaurant-order')(pool),
    cancelTransactionsRestaurant: require('./post-cancel-transactions-restaurant')(pool),
    confirmTransactionsRestaurant: require('./post-confirm-transactions-restaurant')(pool),
    confirmPackagingRestaurant: require('./post-confirm-packaging-restaurant')(pool),
    markRestaurantDelivered: require('./post-mark-restaurant-delivered')(pool),
    markCustomerDelivered: require('./post-mark-customer-delivered')(pool),
});