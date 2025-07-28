const express = require('express');
const router = express.Router();
const profileUserController = require('../controllers/dashboard/userpage/profileUserController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, profileUserController.index);

module.exports = router;
