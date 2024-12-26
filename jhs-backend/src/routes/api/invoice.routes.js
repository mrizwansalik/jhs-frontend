// third party import
const express = require('express');

// import Controller
const invoiceController = require('../../app/controllers/invoice/invoiceController');

// include middleware 
const checkFeaturePermission = require('../../app/middleware/checkFeaturePermission');

const router = express.Router();

router.get('/:id/getInvoice', [checkFeaturePermission('invoice', 'view')], invoiceController.getInvoice);
router.get('/getAllInvoice', [checkFeaturePermission('invoice', 'view')], invoiceController.getAllInvoice);
router.get('/getAllInvoiceWithClient', [checkFeaturePermission('invoice', 'view')], invoiceController.getAllInvoiceWithClient);
router.post('/addInvoice', [checkFeaturePermission('invoice', 'add')], invoiceController.addInvoice);
router.put('/:invoiceId/update', [checkFeaturePermission('invoice', 'update')], invoiceController.updateInvoice);

module.exports = router;
