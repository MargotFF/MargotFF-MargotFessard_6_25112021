const rateLimit = require("express-rate-limit");

const limit = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 3,
    message: "Too many failed login attempts : your account has been disabled for 5 minutes"
})

module.exports = { limit };