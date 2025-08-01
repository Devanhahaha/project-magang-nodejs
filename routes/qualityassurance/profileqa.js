const express = require('express');
const router = express.Router();
const profileQaController = require('../../controllers/dashboard/qualityassurance/profileQaController');
const authMiddleware = require('../../middleware/auth');

router.get('/', authMiddleware, profileQaController.index);

module.exports = router;
