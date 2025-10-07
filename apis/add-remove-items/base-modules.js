module.exports = (pool) => ({
    registerIngredient: require('./register-ingredient')(pool),
    registerProduct: require('./register-product')(pool),
});