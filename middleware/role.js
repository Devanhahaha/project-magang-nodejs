exports.isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
      return next();
    }
    req.flash('error', 'You are not authorized as admin.');
    return res.redirect('/dashboard');
  };
  
exports.isUser = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'user') {
      return next();
    }
    req.flash('error', 'You are not authorized as user.');
    return res.redirect('/dashboard-user');
};

exports.isDeveloper = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'developer') {
      return next();
    }
    req.flash('error', 'You are not authorized as user.');
    return res.redirect('/dashboard-developer');
};

exports.isQa = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'quality assurance') {
      return next();
    }
    req.flash('error', 'You are not authorized as user.');
    return res.redirect('/dashboard-qa');
};

exports.isDoc = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'document') {
      return next();
    }
    req.flash('error', 'You are not authorized as user.');
    return res.redirect('/dashboard-document');
};
  