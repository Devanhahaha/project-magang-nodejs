const express = require('express');
const router = express.Router();
const profileDeveloperController = require('../../controllers/dashboard/developer/profileDeveloperController');
const authMiddleware = require('../../middleware/auth');

router.get('/', authMiddleware, profileDeveloperController.index);

module.exports = router;
