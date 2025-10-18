/**
 * Base module for finder/filter GET operations
 * Exports filtered data retrieval endpoints based on specific conditions
 * @param {Object} pool - MySQL connection pool
 * @returns {Object} Object containing all filtered GET route handlers
 */
module.exports = (pool) => ({
    availableRecipe: require('./get-product-for-recipe')(pool),
    productsWithRecipe: require('./get-product-with-recipe')(pool),
    zeroGradeProducts: require('./get-zero-grade-products')(pool),
    toBeAddedProducts: require('./get-to-be-added-qc')(pool),
    productsForSale: require('./get-product-for-sale')(pool),
    productsForRestaurant: require('./get-product-for-restaurant')(pool),
    customerOrdersWaitForPackaging: require('./get-order-for-packaging')(pool),
    restaurantOrdersWaitForPackaging: require('./get-order-for-packaging-restaurant')(pool),
    customerOrdersPendingDelivery: require('./get-order-pending-delivery')(pool),
    restaurantOrdersPendingDelivery: require('./get-order-pending-delivery-restaurant')(pool)
});