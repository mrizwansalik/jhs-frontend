// third party import
const express = require('express');

// import Controller
const departmentController = require('../../app/controllers/departmentController');

// include middleware 
const checkFeaturePermission = require('../../app/middleware/checkFeaturePermission');

const router = express.Router();

router.get('/all', departmentController.getAllDepartment);

router.get('/:id/getDepartment', [checkFeaturePermission('department', 'view')], departmentController.getDepartment);
router.get('/:id/getByDepartmentName', [checkFeaturePermission('department', 'view')], departmentController.getByDepartmentName);
router.post('/:id/activateDepartment', [checkFeaturePermission('department', 'update')], departmentController.activateDepartment);
router.post('/:id/deactivateDepartment', [checkFeaturePermission('department', 'update')], departmentController.deactivateDepartment);
router.get('/getAllDepartment', [checkFeaturePermission('department', 'view')], departmentController.getAllDepartment);
router.post('/addDepartment', [checkFeaturePermission('department', 'add')], departmentController.addDepartment);
router.put('/:departmentId/update', [checkFeaturePermission('department', 'update')], departmentController.updateDepartment);

module.exports = router;
