module.exports = (pool) => ({
    createSupplyLogs: require('./create-supply-logs')(pool),
});