const express = require('express');
const router = express.Router();
const profileController = require('../controllers/dashboard/profileController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, profileController.index);

module.exports = router;
