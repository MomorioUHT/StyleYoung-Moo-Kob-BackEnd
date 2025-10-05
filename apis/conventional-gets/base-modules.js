module.exports = (pool) => ({
    ingredients: require('./get-ingredient')(pool),
    productsFull: require('./get-product-full')(pool),
    productsMini: require('./get-product-mini')(pool),
    suppliers: require('./get-supplier')(pool),
    staffs: require('./get-staff')(pool),
    supplyLogs: require('./get-supply-logs')(pool),
    restaurants: require('./get-restaurant')(pool),
    restaurantOrders: require('./get-restaurant-order')(pool),
    productionLogs: require('./get-production-logs')(pool),
    qcLogs: require('./get-qc-logs')(pool),
    customers: require('./get-customer')(pool),
    customerOrders: require('./get-customer-order')(pool),
});