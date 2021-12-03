const express = require('express');

const userController = require('../controllers/user');
const max = require('../middleware/limiter');

const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', max.limit, userController.login);

module.exports = router;
