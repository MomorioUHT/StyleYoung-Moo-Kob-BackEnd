module.exports = (pool) => ({
    createSupplyLogs: require('./create-supply-logs')(pool),
    createProductionLogs: require('./create-prod-logs')(pool),
});