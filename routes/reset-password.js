const express = require('express');
const router = express.Router();
const resetpasswordController = require('../controllers/resetpasswordController');

router.get('/forgot-password', resetpasswordController.showForgotForm);
router.post('/forgot-password', resetpasswordController.sendResetLink);

router.get('/reset-password/:token', resetpasswordController.showResetForm);
router.post('/reset-password', resetpasswordController.resetPassword);

module.exports = router;
