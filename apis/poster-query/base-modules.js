module.exports = (pool) => ({
    createSupplyLogs: require('./create-supply-logs')(pool),
    createProductionLogs: require('./create-prod-logs')(pool),
    createQCLogs: require('./create-qc-logs')(pool),
    acceptProduct: require('./accept-product')(pool),
    createCustomerOrder: require('./create-customer-order')(pool),
    customerOrders: require('../poster-query/post-customer-order')(pool),
    customerOrderDetails: require('../poster-query/post-customer-order-detail')(pool),
    confirmTransactions: require('../poster-query/post-confirm-transactions')(pool),
    cancelTransactions: require('../poster-query/post-cancel-transactions')(pool),
});