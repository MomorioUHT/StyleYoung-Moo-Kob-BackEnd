module.exports = (pool) => ({
    customerOrderDetail: require('./get-customer-order-detail')(pool),
    allCustomerOrders: require('./get-customer-order')(pool),
    customers: require('./get-customer')(pool),
    ingredients: require('./get-ingredient')(pool),
    productsFull: require('./get-product-full')(pool),
    productsMini: require('./get-product-mini')(pool),
    productionLogs: require('./get-production-logs')(pool),
    qcLogs: require('./get-qc-logs')(pool),
    allRestaurantOrders: require('./get-restaurant-order')(pool),
    restaurants: require('./get-restaurant')(pool),
    staffs: require('./get-staff')(pool),
    suppliers: require('./get-supplier')(pool),
    supplyLogs: require('./get-supply-logs')(pool),
    recipes: require('./get-recipe')(pool)
});