/**
 * Base module for add/remove item operations
 * Exports all registration endpoints for ingredients, products, restaurants, suppliers, and recipes
 * @param {Object} pool - MySQL connection pool
 * @returns {Object} Object containing all registration route handlers
 */
module.exports = (pool) => ({
    registerIngredient: require('./register-ingredient')(pool),
    registerProduct: require('./register-product')(pool),
    registerRestaurant: require('./register-restaurant')(pool),
    registerSupplier: require('./register-supplier')(pool),
    registerRecipe: require('./register-recipe')(pool),
});