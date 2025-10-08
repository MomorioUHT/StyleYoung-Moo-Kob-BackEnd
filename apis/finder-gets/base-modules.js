module.exports = (pool) => ({
    availableRecipe: require('./get-product-for-recipe')(pool)
});