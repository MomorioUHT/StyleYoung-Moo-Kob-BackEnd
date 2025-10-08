module.exports = (pool) => ({
    registerIngredient: require('./register-ingredient')(pool),
    registerProduct: require('./register-product')(pool),
    registerRestaurant: require('./register-restaurant')(pool),
    registerSupplier: require('./register-supplier')(pool)
});