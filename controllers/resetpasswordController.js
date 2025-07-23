const crypto = require('crypto');
const User = require('../models/User'); // Sequelize
const { validationResult, body } = require('express-validator');
const sendMail = require('../utils/sendMail');

exports.showForgotForm = (req, res) => {
  res.render('auth/forgot-password', {
    appName: process.env.APP_NAME || 'App',
    layout: false,
    status: req.flash('status'),
    message: req.flash('message'),
    old: req.flash('old')[0] || {}
  });
};

exports.sendResetLink = [
  body('email').isEmail().withMessage('Valid email required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('status', 'error');
      req.flash('message', errors.array()[0].msg);
      req.flash('old', req.body);
      return res.redirect('/forgot-password');
    }
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      req.flash('status', 'error');
      req.flash('message', 'Email not registered');
      req.flash('old', req.body);
      return res.redirect('/forgot-password');
    }
    const token = crypto.randomBytes(30).toString('hex');
    await PasswordReset.upsert({ email, token, createdAt: new Date() });
    const resetLink = `${req.protocol}://${req.get('host')}/reset-password/${token}`;
    await sendMail(email, 'Password Reset', `Click here to reset: ${resetLink}`);
    req.flash('status', 'success');
    req.flash('message', 'Reset link has been sent to your email!');
    res.redirect('/forgot-password');
  }
];

exports.showResetForm = (req, res) => {
  res.render('auth/reset-password', {
    appName: process.env.APP_NAME || 'App',
    token: req.params.token,
    status: req.flash('status'),
    message: req.flash('message')
  });
};

exports.resetPassword = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password min 8'),
  body('password_confirmation').custom((val, { req }) => val === req.body.password).withMessage('Passwords must match'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('status', 'error');
      req.flash('message', errors.array()[0].msg);
      return res.redirect('back');
    }
    const { email, password, token } = req.body;
    const record = await PasswordReset.findOne({ where: { email, token } });
    if (!record) {
      req.flash('status', 'error');
      req.flash('message', 'Invalid or expired token');
      return res.redirect('/forgot-password');
    }
    const hashed = await bcrypt.hash(password, 10);
    await User.update({ password: hashed }, { where: { email } });
    await record.destroy();
    req.flash('status', 'success');
    req.flash('message', 'Password reset successful! You can now login.');
    res.redirect('/login');
  }
];
