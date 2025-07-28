const crypto = require('crypto');
const User = require('../../models/dashboard/User'); // Sequelize
const sequelize = require('../../config/database'); // sesuaikan path-nya
const { QueryTypes } = require('sequelize');
const { validationResult, body } = require('express-validator');
const transporter = require('../../utils/sendMail');
const bcrypt = require('bcryptjs');

exports.showForgotForm = (req, res) => {
  res.render('auth/forgot-password', {
    appName: 'CV Ramah Teknologi',
    layout: false,
    status: req.flash('status'),
    message: req.flash('message'),
    old: req.flash('old')[0] || {}
  });
};

exports.sendResetLink = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    res.render('auth/forgot-password', {
      layout: false,
      appName: 'CV Ramah Teknologi',
      status: 'error',
      message: 'Email tidak terdaftar',
      old: { email }, 
    });    
  }

  const token = crypto.randomBytes(32).toString('hex');
  const now = new Date();

  // updateOrInsert: hapus dulu kalau ada, lalu insert baru
  await sequelize.query(
    `DELETE FROM password_reset_tokens WHERE email = :email`,
    { replacements: { email }, type: QueryTypes.DELETE }
  );

  await sequelize.query(
    `INSERT INTO password_reset_tokens (email, token, created_at) VALUES (:email, :token, :created_at)`,
    {
      replacements: { email, token, created_at: now },
      type: QueryTypes.INSERT
    }
  );

  const resetLink = `${req.protocol}://${req.get('host')}/reset-password/${token}`;

  // Kirim email (gunakan nodemailer)
  await transporter.sendMail({
    to: email,
    subject: 'Reset Password Link',
    text: `Klik link berikut untuk reset password Anda: ${resetLink}`
  });

  res.render('auth/forgot-password', {
    layout: false,
    appName: 'CV Ramah Teknologi',
    status: 'success',
    message: 'A password reset link has been sent to your email..',
    old: { email }
  });  
};

exports.showResetForm = async (req, res) => {
  const token = req.params.token;

  // Cek token valid atau tidak
  const [results] = await sequelize.query(
    `SELECT * FROM password_reset_tokens WHERE token = :token LIMIT 1`,
    { replacements: { token }, type: QueryTypes.SELECT }
  );

  if (!results) {
    return res.render('auth/reset-password', { 
    error: 'Token tidak valid atau sudah kedaluwarsa.', 
    layout: false,
    token: null });
  }

  res.render('auth/reset-password', { 
  layout: false,
  token 
});
};

exports.resetPassword = async (req, res) => {
  const { email, password, password_confirmation, token } = req.body;

  if (password !== password_confirmation) {
    return res.render('auth/reset-password', 
    { 
    error: 'Konfirmasi password tidak cocok.',
    layout: false,
    token 
    });
  }

  // Cek apakah token cocok dengan email
  const [resetData] = await sequelize.query(
    `SELECT * FROM password_reset_tokens WHERE email = :email AND token = :token LIMIT 1`,
    {
      replacements: { email, token },
      type: QueryTypes.SELECT
    }
  );

  if (!resetData) {
    return res.render('auth/reset-password', { 
    error: 'Token tidak valid.', 
    layout: false,
    token });
  }

  // Update password user
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.update(
    { password: hashedPassword },
    { where: { email } }
  );

  // Hapus token
  await sequelize.query(
    `DELETE FROM password_reset_tokens WHERE email = :email`,
    {
      replacements: { email },
      type: QueryTypes.DELETE
    }
  );

  req.flash('success', 'Password reset successful! You can now login.');
  res.redirect('/login');
};