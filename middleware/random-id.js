/**
 * Generates a random alphanumeric ID
 * @returns {string} An 8-character random ID consisting of uppercase, lowercase letters and digits
 */
module.exports = function generate() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const ID_LENGTH = 8;
    let id = '';
    
    for (let i = 0; i < ID_LENGTH; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return id;
};