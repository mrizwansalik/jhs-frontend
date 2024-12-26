// third party import
const express = require('express');

// import Controller
const employeeController = require('../../app/controllers/employeeController');

// include middleware 
const checkFeaturePermission = require('../../app/middleware/checkFeaturePermission');

const router = express.Router();

router.get('/all', employeeController.getAllEmployee);
router.get('/allWithDetail', employeeController.getAllEmployeeWithDetail);

router.get('/:id/getEmployee', [checkFeaturePermission('employee', 'view')], employeeController.getEmployee);
router.get('/:id/getEmployeeWithDetail', [checkFeaturePermission('employee', 'view')], employeeController.getEmployeeWithDetail);
router.get('/getAllEmployee', [checkFeaturePermission('employee', 'view')], employeeController.getAllEmployee);
router.get('/getAllEmployeeWithDetail', [checkFeaturePermission('employee', 'view')], employeeController.getAllEmployeeWithDetail);
router.post('/assignEmployee', [checkFeaturePermission('employee', 'assign')], employeeController.assignEmployee);
router.put('/:employeeId/updateEmployee', [checkFeaturePermission('employee', 'assign')], employeeController.updateEmployee);
router.put('/:employeeId/unassignEmployee', [checkFeaturePermission('employee', 'unassign')], employeeController.unassignEmployee);

module.exports = router;
