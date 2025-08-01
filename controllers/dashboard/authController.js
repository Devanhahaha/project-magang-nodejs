const bcrypt = require('bcryptjs');
const { User, Role } = require('../../models/dashboard/associations');
const { body, validationResult, check } = require('express-validator');
const axios = require('axios');
const RECAPTCHA_SECRET = '6LcfD4crAAAAAP9ogO67LGJOlgsfyV97Yyl33ucw';

exports.showLogin = (req, res) => {
  res.render('auth/login', {
    layout: false,
    appName: 'CV Ramah Teknologi',
    siteKey: '6LcfD4crAAAAAALgkLPDMqxPEbFDqIt6YnYyZFcF',
  });
};

exports.authenticate = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', 'Email dan password tidak valid!');
    return res.redirect('/login');
  }

  const token = req.body['g-recaptcha-response'];
  if (!token) {
    req.flash('error', 'Captcha tidak boleh kosong.');
    return res.redirect('/login');
  }

  // Verifikasi captcha ke Google
  try {
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret: RECAPTCHA_SECRET,
        response: token,
      },
    });

    if (!response.data.success) {
      req.flash('error', 'Captcha tidak valid!');
      return res.redirect('/login');
    }
  } catch (err) {
    console.error('❌ Error verifying captcha:', err);
    req.flash('error', 'Terjadi kesalahan saat verifikasi captcha.');
    return res.redirect('/login');
  }

  // Lanjut login setelah captcha sukses
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email },
    include: [
      {
        model: Role,
        as: 'Roles',
        through: { attributes: [] },
      },
    ],
  });

  if (!user) {
    req.flash('error', 'Email tidak ditemukan!');
    return res.redirect('/login');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    req.flash('error', 'Password salah!');
    return res.redirect('/login');
  }

  const roleName = user.Roles?.[0]?.name || '';

  req.session.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    contact: user.contact,
    role: roleName,
    isVerified: true, 
  };

  const remember = req.body.remember;

  if (remember) {
    // Simpan cookie dengan waktu hidup lebih panjang (misal 7 hari)
    res.cookie('remember_token', user.id, {
      maxAge: 30 * 60 * 1000,
      httpOnly: true,
    });
  }

  req.flash('success', 'Login Successfully!');

  if (roleName === 'admin') {
    return res.redirect('/dashboard');
  } else if (roleName === 'user') {
    return res.redirect('/dashboard-user');
  } else if (roleName === 'developer') {
    return res.redirect('/dashboard-developer');
  } else if (roleName === 'quality assurance') {
    return res.redirect('/dashboard-qa');
  } else if (roleName === 'document') {
    return res.redirect('/dashboard-document');
  } else {
    req.flash('error', 'Role tidak dikenali.');
    return res.redirect('/login');
  }
};

exports.validateLogin = [
  check('email').isEmail().withMessage('Email tidak valid').normalizeEmail(),
  check('password').notEmpty().withMessage('Password wajib diisi'),
];

exports.register = [
  // Middleware Validasi
  body('name').notEmpty().withMessage('Name is required'),
  body('contact').notEmpty().withMessage('Contact is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password min 8 char')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase')
    .matches(/[0-9]/).withMessage('Password must contain number')
    .matches(/[^A-Za-z0-9]/).withMessage('Password must contain symbol'),
  body('password_confirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match.');
    }
    return true;
  }),
  body('trems').equals('on').withMessage('You must accept the terms and conditions.'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('status', 'error');
      req.flash('message', errors.array()[0].msg);
      req.flash('old', req.body);
      return res.redirect('/register');
    }

    try {
      const existingUser = await User.findOne({ where: { email: req.body.email } });
      if (existingUser) {
        req.flash('error', 'Email already in use.');
        req.flash('old', req.body);
        return res.redirect('/register');
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = await User.create({
        name: req.body.name,
        contact: req.body.contact,
        email: req.body.email,
        password: hashedPassword,
      });

      const roleUser = await Role.findOne({ where: { name: 'user' } });
      if (roleUser) {
        await user.addRole(roleUser); 
      }

      req.flash('success', 'Registration successful! You can now Login.');
      return res.redirect('/login');
    } catch (err) {
      console.error('❌ Register Error:', err);
      req.flash('status', 'error');
      req.flash('message', 'Something went wrong!');
      req.flash('old', req.body);
      return res.redirect('/register');
    }    
  }
];

exports.logout = (req, res) => {
  req.flash('success', 'Logout berhasil!'); 
  res.clearCookie('remember_token');
  req.session.destroy(() => {
    res.redirect('/login'); 
  });
};
