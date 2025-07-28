module.exports = (req, res, next) => {
    if (!req.session.user) {
      req.session.error = 'Silakan login terlebih dahulu';
      return res.redirect('/login');
    }
    next();
};