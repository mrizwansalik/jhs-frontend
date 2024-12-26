// third party import
const express = require('express');

// import Controller
const journalController = require('../../app/controllers/journalController');

// include middleware 
const checkFeaturePermission = require('../../app/middleware/checkFeaturePermission');

const router = express.Router();

router.get('/getJournal',  journalController.getJournal);

router.get('/getJournalWithManager', [checkFeaturePermission('journal', 'view')], journalController.getJournalWithManager);

router.post('/updateJournal', [checkFeaturePermission('journal', 'add')], journalController.updateJournal);

module.exports = router;
