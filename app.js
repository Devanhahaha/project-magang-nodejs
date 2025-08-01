const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const checkRememberedUser = require('./middleware/checkRememberedUser');

require('dotenv').config();
require('./models/dashboard/associations');
const Component = require('./models/dashboard/Component');
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
const portofolioprivateRoutes = require('./routes/portofolioprivate');
const dashboardUserRoutes = require('./routes/dashboarduser');
const newsUserRoutes = require('./routes/newsuser');
const settingsUserRoutes = require('./routes/settingsuser');
const profileUserRoutes = require('./routes/profileuser');
const calendarRoutes = require('./routes/calendar');
const clientRoutes = require('./routes/client');
const projectRoutes = require('./routes/project');
const mainRoutes = require('./routes/homepage/index');

// developer
const dashboardDeveloperRoutes = require('./routes/developer/dashboarddev');
const profileDeveloperRoutes = require('./routes/developer/profiledev');
const projectDeveloperRoutes = require('./routes/developer/projectdev');
const settingDeveloperRoutes = require('./routes/developer/settingdev');

// qa
const dashboardQaRoutes = require('./routes/qualityassurance/dashboardqa');
const profileQaRoutes = require('./routes/qualityassurance/profileqa');
const projectQaRoutes = require('./routes/qualityassurance/projectqa');
const settingQaRoutes = require('./routes/qualityassurance/settingqa');

const sequelize = require('./config/database');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');

// Middleware Parsing
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Static Files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/aos', express.static(__dirname + '/node_modules/aos'));
app.use('/storage', express.static(path.join(__dirname, 'public/storage')));

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// EJS Layouts Setup
app.use(expressLayouts);
app.set('layout', 'dashboard/layouts/main'); // default layout


// Session dan Flash
app.use(session({
  secret: 'your_secret_session',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());


app.use(cookieParser());
app.use(checkRememberedUser);

// 🔥 GLOBAL FLASH Middleware (penting untuk SweetAlert bekerja!)
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.old = req.flash('old')[0] || {};
  res.locals.errors = req.flash('errors') || [];
  next();
});

// Global Middleware lainnya
app.use((req, res, next) => {
  res.locals.title = 'Default Title';
  res.locals.appName = 'CV Ramah Teknologi';
  res.locals.currentRoute = req.path;
  res.locals.user = req.session.user || null;
  next();
});

app.use('/', mainRoutes);

// Auth Middleware untuk halaman yang butuh login
const authMiddleware = require('./middleware/auth');
app.use('/dashboard', authMiddleware);
app.use('/dashboard-user', authMiddleware);
app.use('/dashboard/home', authMiddleware);
app.use('/dashboard/services', authMiddleware);
app.use('/dashboard/news', authMiddleware);
app.use('/dashboard-user/news-user', authMiddleware);
app.use('/dashboard/portfolio', authMiddleware);
app.use('/dashboard/portfolioprivate', authMiddleware);
app.use('/dashboard/project', authMiddleware);
app.use('/dashboard/about', authMiddleware);
app.use('/dashboard/profile', authMiddleware);
app.use('/dashboard/settings', authMiddleware);
app.use('/dashboard-user/settings-user', authMiddleware);
app.use('/dashboard-user/profile-user', authMiddleware);
app.use('/calendar', authMiddleware);
app.use('/client', authMiddleware);

// developer
app.use('/dashboard-developer/profile-developer', authMiddleware);
app.use('/dashboard-developer/project-developer', authMiddleware);
app.use('/dashboard-developer/setting-developer', authMiddleware);

// qa
app.use('/dashboard-qa/profile-qa', authMiddleware);
app.use('/dashboard-qa/project-qa', authMiddleware);
app.use('/dashboard-qa/setting-qa', authMiddleware);

// Routes
app.use('/', authRoutes);
app.use('/', resetpasswordRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/dashboard-user', dashboardUserRoutes);
app.use('/dashboard/home', homeRoutes);
app.use('/dashboard/about', aboutRoutes);
app.use('/dashboard/profile', profileRoutes);
app.use('/dashboard-user/profile-user', profileUserRoutes);
app.use('/dashboard/settings', settingsRoutes);
app.use('/dashboard-user/settings-user', settingsUserRoutes);
app.use('/dashboard/services', servicesRoutes);
app.use('/dashboard/news', newsRoutes);
app.use('/dashboard-user/news-user', newsUserRoutes);
app.use('/dashboard/portofolio', portofolioRoutes);
app.use('/dashboard/portofolioprivate', portofolioprivateRoutes);
app.use('/dashboard/project', projectRoutes);
app.use('/calendar', calendarRoutes);
app.use('/client', clientRoutes);

// developer
app.use('/dashboard-developer', dashboardDeveloperRoutes);
app.use('/dashboard-developer/project-developer', projectDeveloperRoutes);
app.use('/dashboard-developer/profile-developer', profileDeveloperRoutes);
app.use('/dashboard-developer/setting-developer', settingDeveloperRoutes);

// qa
app.use('/dashboard-qa', dashboardQaRoutes);
app.use('/dashboard-qa/project-qa', projectQaRoutes);
app.use('/dashboard-qa/profile-qa', profileQaRoutes);
app.use('/dashboard-qa/setting-qa', settingQaRoutes);

// Database Connection & Start Server
sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
    });
  })
  .catch(err => console.error('DB connection failed:', err));
