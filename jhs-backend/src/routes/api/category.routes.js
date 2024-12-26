// third party import
const express = require('express');

// import Controller
const categoryController = require('../../app/controllers/categoryController');

// include middleware 
const checkFeaturePermission = require('../../app/middleware/checkFeaturePermission');

const router = express.Router();

router.get('/all', categoryController.getAllCategory);

router.get('/:id/getCategory', [checkFeaturePermission('category', 'view')], categoryController.getCategory);
router.get('/:id/getByCategoryName', [checkFeaturePermission('category', 'view')], categoryController.getByCategoryName);
router.post('/:id/activateCategory', [checkFeaturePermission('category', 'update')], categoryController.activateCategory);
router.post('/:id/deactivateCategory', [checkFeaturePermission('category', 'update')], categoryController.deactivateCategory);
router.get('/getAllCategory', [checkFeaturePermission('category', 'view')], categoryController.getAllCategory);
router.post('/addCategory', [checkFeaturePermission('category', 'add')], categoryController.addCategory);
router.put('/:categoryId/update', [checkFeaturePermission('category', 'update')], categoryController.updateCategory);

module.exports = router;
