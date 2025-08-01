// controllers/dashboardController.js
const User = require('../../../models/dashboard/User');
const Project = require('../../../models/dashboard/Project');

exports.index = async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user.id);
    
    const totalProject = await Project.count({
        where: {
            document_id: user.id
        }
    });

    const target = 50;
    const persenProject = Math.min((totalProject / target) * 100, 100);

    const date = new Date();
    const currentDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    res.render('dashboard/documentpage/dashboard/index', {
      title: 'Dashboard Document',
      layout: 'dashboard/documentpage/layouts/main',
      user,
      currentDate,
      totalProject,
      persenProject,
      success: res.locals.success.length ? res.locals.success[0] : null,
      error: res.locals.error.length ? res.locals.error[0] : null
    });

  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).send('Internal Server Error');
  }
};
