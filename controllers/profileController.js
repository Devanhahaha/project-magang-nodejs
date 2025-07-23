exports.index = (req, res) => {
    const user = req.session.user;
  
    if (!user) {
      return res.redirect('/login');
    }
  
    res.render('adminpage/profile/index', {
      layout: 'layouts/main',
      title: 'Profile',
      user: {
        name: user.name,
        email: user.email,
        contact: user.contact || '-',
        role: user.role || 'User', // ✅ langsung pakai string
        createdAt: user.createdAt || new Date()
      }
    });
  };
  