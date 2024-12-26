// third party import
const express = require('express');

// import Controller
const roleController = require('../../app/controllers/rolePermission/roleController');

// include middleware
const isAdministration = require('../../app/middleware/Administration');

const router = express.Router();

router.get('/:id/getRole', [isAdministration], roleController.getRole);
router.get('/getAllRole', [isAdministration], roleController.getAllRole);
router.put('/:roleId/update', [isAdministration], roleController.updateRole);
router.post('/add', [isAdministration], roleController.addRole);

module.exports = router;
