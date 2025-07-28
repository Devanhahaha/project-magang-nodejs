const User = require('../models/dashboard/User');

const checkRememberedUser = async (req, res, next) => {
  if (!req.session.user && req.cookies.remember_token) {
    const user = await User.findOne({ where: { remember_token: req.cookies.remember_token } });

    if (user) {
      const role = await user.getRoles(); // Jika kamu pakai relasi Role
      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        contact: user.contact,
        role: role?.[0]?.name || '',
        isVerified: true,
      };
    }
  }

  next();
};

module.exports = checkRememberedUser;