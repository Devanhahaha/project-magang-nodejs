// routes/dashboard.js
const express = require('express');
const router = express.Router();
const dashboardUserController = require('../controllers/dashboard/userpage/dashboardUserController');
const authMiddleware = require('../middleware/auth'); // cek login session
const roleMiddleware = require('../middleware/role');

function ensureCaptchaVerified(req, res, next) {
    if (req.session.user && req.session.user.isVerified) {
      return next();
    }
    req.flash('error', 'Silakan verifikasi captcha terlebih dahulu.');
    res.redirect('/verify-recaptcha');
  }
  
router.get('/', ensureCaptchaVerified, authMiddleware, roleMiddleware.isUser, dashboardUserController.index);
module.exports = router;
