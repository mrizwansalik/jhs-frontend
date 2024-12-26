// third party import
const express = require('express');

// import Controller
const companyController = require('../../app/controllers/companyController');

// include middleware 
const checkFeaturePermission = require('../../app/middleware/checkFeaturePermission');

const router = express.Router();

router.get('/getCompany',  companyController.getCompany);

router.get('/getCompanyWithOwner', [checkFeaturePermission('company', 'view')], companyController.getCompanyWithOwner);

router.post('/updateCompany', [checkFeaturePermission('company', 'add')], companyController.updateCompany);

module.exports = router;
