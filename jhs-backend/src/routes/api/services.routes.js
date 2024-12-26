// third party import
const express = require('express');

// import Controller
const servicesController = require('../../app/controllers/services/servicesController');

// include middleware 
const checkFeaturePermission = require('../../app/middleware/checkFeaturePermission');

const router = express.Router();

router.get('/:id/getServices', [checkFeaturePermission('services', 'view')], servicesController.getServices);
router.get('/getAllServices', [checkFeaturePermission('services', 'view')], servicesController.getAllServices);
router.post('/addServices', [checkFeaturePermission('services', 'add')], servicesController.addServices);
router.put('/:serviceId/update', [checkFeaturePermission('services', 'update')], servicesController.updateServices);

module.exports = router;
