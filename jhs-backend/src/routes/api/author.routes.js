// third party import
const express = require('express');

// import Controller
const authorController = require('../../app/controllers/user/authorController');

const isAuth = require('../../app/middleware/auth');

const router = express.Router();

router.post('/searchByEmail', [isAuth], authorController.searchByEmail);
router.post('/addPublicUser', [isAuth], authorController.addPublicUser);

module.exports = router;
