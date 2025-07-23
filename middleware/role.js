exports.isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
      return next();
    }
    req.flash('error', 'You are not authorized as admin.');
    return res.redirect('/dashboard-user');
  };
  
  exports.isUser = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'user') {
      return next();
    }
    req.flash('error', 'You are not authorized as user.');
    return res.redirect('/dashboard');
  };
  