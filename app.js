const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');

require('dotenv').config();
require('./models/associations');
const Component = require('./models/Component');
app.use(async (req, res, next) => {
  const components = await Component.findOne();
  res.locals.components = components;
  next();
});

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const resetpasswordRoutes = require('./routes/reset-password');
const homeRoutes = require('./routes/home');
const aboutRoutes = require('./routes/about');
const profileRoutes = require('./routes/profile');
const settingsRoutes = require('./routes/settings');
const servicesRoutes = require('./routes/services');
const newsRoutes = require('./routes/news');
const portofolioRoutes = require('./routes/portofolio');
const dashboardUserRoutes = require('./routes/dashboarduser');
const newsUserRoutes = require('./routes/newsuser');
const settingsUserRoutes = require('./routes/settingsuser');
const profileUserRoutes = require('./routes/profileuser');
const calendarRoutes = require('./routes/calendar');

const sequelize = require('./config/database');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');

// Middleware Parsing
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Static Files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/storage', express.static(path.join(__dirname, 'public/storage')));

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// EJS Layouts Setup
app.use(expressLayouts);
app.set('layout', 'layouts/main'); // default layout

// Session dan Flash
app.use(session({
  secret: 'your_secret_session',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

// 🔥 GLOBAL FLASH Middleware (penting untuk SweetAlert bekerja!)
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.old = req.flash('old')[0] || {};
  res.locals.errors = req.flash('errors') || [];
  next();
});

// Auth Middleware untuk halaman yang butuh login
const authMiddleware = require('./middleware/auth');
app.use('/dashboard', authMiddleware);
app.use('/dashboard-user', authMiddleware);
app.use('/home', authMiddleware);
app.use('/services', authMiddleware);
app.use('/news', authMiddleware);
app.use('/news-user', authMiddleware);
app.use('/portfolio', authMiddleware);
app.use('/about', authMiddleware);
app.use('/profile', authMiddleware);
app.use('/settings', authMiddleware);
app.use('/settings-user', authMiddleware);
app.use('/profile-user', authMiddleware);
app.use('/calendar', authMiddleware);

// Global Middleware lainnya
// Global Middleware lainnya
app.use((req, res, next) => {
  res.locals.title = 'Default Title';
  res.locals.appName = 'CV Ramah Technology';
  res.locals.currentRoute = req.path.split('/')[1] || 'news';
  // console.log('🌟 SESSION USER:', req.session.user);
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/', authRoutes);
app.use('/', resetpasswordRoutes);
app.use('/', dashboardRoutes);
app.use('/dashboard-user', dashboardUserRoutes);
app.use('/home', homeRoutes);
app.use('/about', aboutRoutes);
app.use('/profile', profileRoutes);
app.use('/profile-user', profileUserRoutes);
app.use('/settings', settingsRoutes);
app.use('/settings-user', settingsUserRoutes);
app.use('/services', servicesRoutes);
app.use('/news', newsRoutes);
app.use('/news-user', newsUserRoutes);
app.use('/portofolio', portofolioRoutes);
app.use('/calendar', calendarRoutes);

// Database Connection & Start Server
sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
    });
  })
  .catch(err => console.error('DB connection failed:', err));
