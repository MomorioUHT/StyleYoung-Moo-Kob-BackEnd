module.exports = (pool) => ({
    availableRecipe: require('./get-product-for-recipe')(pool),
    productsWithRecipe: require('./get-product-with-recipe')(pool),
    zeroGradeProducts: require('./get-zero-grade-products')(pool)
});