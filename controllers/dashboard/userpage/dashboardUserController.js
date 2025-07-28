// controllers/dashboardController.js
const User = require('../../../models/dashboard/User');
const News = require('../../../models/dashboard/News');

exports.index = async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user.id);
    
    const totalNews = await News.count();

    const target = 50;
    const persenNews = Math.min((totalNews / target) * 100, 100);

    const date = new Date();
    const currentDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    res.render('dashboard/userpage/dashboard/index', {
      title: 'Dashboard User',
      layout: 'dashboard/userpage/layouts/main',
      user,
      currentDate,
      totalNews,
      persenNews,
      success: res.locals.success.length ? res.locals.success[0] : null,
      error: res.locals.error.length ? res.locals.error[0] : null
    });

  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).send('Internal Server Error');
  }
};
