const express = require('express');
const { login } = require('./admin.controller');
const router = express.Router();

router.post('/login', login);

module.exports = router;