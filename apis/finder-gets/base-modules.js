module.exports = (pool) => ({
    getRecipe: require('./get-recipe')(pool),
});