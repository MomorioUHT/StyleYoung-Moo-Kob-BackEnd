module.exports = (pool) => ({
    availableRecipe: require('./get-product-for-recipe')(pool),
    zeroGradeProducts: require('./get-zero-grade-products')(pool)
});