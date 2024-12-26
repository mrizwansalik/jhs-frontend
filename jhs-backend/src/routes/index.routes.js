// third party import
const express = require('express');
const router = express.Router();

router.use('/app/db/', require('./api/dbSeed.routes'));

router.use('/api/home/', require('./api/home.routes'));

router.use('/api/profile/', require('./api/profile.routes'));
router.use('/api/user/', require('./api/user.routes'));
router.use('/api/auth/', require('./api/auth.routes'));
router.use('/api/role/', require('./api/role.routes'));
router.use('/api/permission/', require('./api/permission.routes'));
router.use('/api/department/', require('./api/department.routes'));
router.use('/api/category/', require('./api/category.routes'));
router.use('/api/journal/', require('./api/journal.routes'));
router.use('/api/company/', require('./api/company.routes'));
router.use('/api/services/', require('./api/services.routes'));
router.use('/api/invoice/', require('./api/invoice.routes'));
router.use('/api/employee/', require('./api/employee.routes'));

router.use('/api/articleStatus/', require('./api/articleStatus.routes'));
router.use('/api/articleMeta/', require('./api/articleMeta.routes'));
router.use('/api/articleType/', require('./api/articleType.routes'));
router.use('/api/article/', require('./api/article.routes'));
router.use('/api/articleRevision/', require('./api/articleRevision.routes'));
router.use('/api/articleLanguageCorrection/', require('./api/articleLanguageCorrection.routes'));
router.use('/api/task/', require('./api/articleTask.routes'));
router.use('/api/articleProcessing/', require('./api/articleProcessing.routes'));

router.use('/api/articleTask/', require('./api/articleTask.routes'));

router.use('/api/articlePublished/', require('./api/articlePublished.routes'));

router.use('/api/author/', require('./api/author.routes'));

router.use('/api/chat/', require('./api/chat.routes'));

module.exports = router;
