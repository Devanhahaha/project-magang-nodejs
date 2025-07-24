const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyEmailController = require('../controllers/verifyEmailController');
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 3, 
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res, next, options) => {
    req.flash('error', 'Too many login attempts. Please try again after 1 minute.');
    req.flash('old', req.body);
    res.redirect('/login');
  }
});

router.get('/', (req, res) => {
  res.redirect('/login');
});

router.get('/register', (req, res) => {
  res.render('auth/register', {
    appName: 'CV Ramah Technology',
    layout: false,
    old: req.flash('old')[0] || {},
    status: req.flash('status')[0],
    message: req.flash('message')[0],
    success: req.flash('success')[0]
  });
});

router.get('/login', authController.showLogin);
router.post('/authentication', loginLimiter, authController.validateLogin, authController.authenticate);
router.post('/register-authentication', authController.register);
router.get('/logout', authController.logout);

router.get('/email/verify', verifyEmailController.showVerificationNotice);
router.get('/email/resend', verifyEmailController.sendVerificationLink);

module.exports = router;
