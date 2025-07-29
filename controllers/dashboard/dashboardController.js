// controllers/dashboardController.js
const User = require('../../models/dashboard/User');
const News = require('../../models/dashboard/News');
const Portofolio = require('../../models/dashboard/Portofolio');
const Services = require('../../models/dashboard/Services');
const Calendar = require('../../models/dashboard/Calendar');
const Visitor = require('../../models/dashboard/Visitor');
const { Sequelize } = require('sequelize');

exports.index = async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user.id);
    
    const totalNews = await News.count();
    const totalPortofolio = await Portofolio.count();
    const totalServices = await Services.count();
    const totalVisitor = await Visitor.count();

    const visitorDaily = await Visitor.findAll({
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('visited_at')), 'date'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: [Sequelize.fn('DATE', Sequelize.col('visited_at'))],
      order: [[Sequelize.fn('DATE', Sequelize.col('visited_at')), 'ASC']],
      limit: 7
    });

    const dailyLabels = visitorDaily.map(v => v.getDataValue('date'));
    const dailyCounts = visitorDaily.map(v => v.getDataValue('count'));

    const today = await Visitor.count({
      where: Sequelize.where(Sequelize.fn('DATE', Sequelize.col('visited_at')), new Date())
    });
    const yesterday = await Visitor.count({
      where: Sequelize.where(Sequelize.fn('DATE', Sequelize.col('visited_at')), new Date(Date.now() - 86400000))
    });
    
    const growth = yesterday > 0 ? (((today - yesterday) / yesterday) * 100).toFixed(2) : 100;
    
    const target = 50;
    const persenNews = Math.min((totalNews / target) * 100, 100);
    const persenPortofolio = Math.min((totalPortofolio / target) * 100, 100);
    const persenServices = Math.min((totalServices / target) * 100, 100);

    const date = new Date();
    const currentDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const calendars = await Calendar.findAll();

    res.render('dashboard/adminpage/dashboard/dashboard', {
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
      totalVisitor,
      dailyLabels,
      dailyCounts,
      growth,
      success: res.locals.success.length ? res.locals.success[0] : null,
      error: res.locals.error.length ? res.locals.error[0] : null
    });

  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).send('Internal Server Error');
  }
};
