// controllers/dashboardController.js
const User = require('../models/User');
const News = require('../models/News');
const Portofolio = require('../models/Portofolio');
const Services = require('../models/Services');
const Calendar = require('../models/Calendar');

exports.index = async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user.id);
    
    const totalNews = await News.count();
    const totalPortofolio = await Portofolio.count();
    const totalServices = await Services.count();

    const target = 50;
    const persenNews = Math.min((totalNews / target) * 100, 100);
    const persenPortofolio = Math.min((totalPortofolio / target) * 100, 100);
    const persenServices = Math.min((totalServices / target) * 100, 100);

    const date = new Date();
    const currentDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const calendars = await Calendar.findAll();

    res.render('adminpage/dashboard/dashboard', {
      calendars,
      title: 'Dashboard',
      user,
      currentDate,
      totalNews,
      persenNews,
      totalPortofolio,
      persenPortofolio,
      totalServices,
      persenServices,
      success: res.locals.success.length ? res.locals.success[0] : null,
      error: res.locals.error.length ? res.locals.error[0] : null
    });

  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).send('Internal Server Error');
  }
};
