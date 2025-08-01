const express = require('express');
const router = express.Router();
const profileDocController = require('../../controllers/dashboard/document/profileDocumentController');
const authMiddleware = require('../../middleware/auth');

router.get('/', authMiddleware, profileDocController.index);

module.exports = router;
