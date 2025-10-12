module.exports = (pool) => ({
    availableRecipe: require('./get-product-for-recipe')(pool),
    productsWithRecipe: require('./get-product-with-recipe')(pool),
    zeroGradeProducts: require('./get-zero-grade-products')(pool),
    toBeAddedProducts: require('./get-to-be-added-qc')(pool),
    productsForSale: require('./get-product-for-sale')(pool),
    productsForRestaurant: require('./get-product-for-restaurant')(pool),
    customerOrdersWaitForPackaging: require('./get-order-for-packaging')(pool),
    restaurantOrdersWaitForPackaging: require('./get-order-for-packaging-restaurant')(pool)
});