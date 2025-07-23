exports.showVerificationNotice = (req, res) => {
    const user = req.session.user;
  
    if (!user) return res.redirect('/login');
  
    res.render('auth/verify-email', {
      appName: process.env.APP_NAME,
      email: user.email,
      layout: false,
      success: req.flash('success'),
      error: req.flash('error')
    });
  };
  
  exports.sendVerificationLink = async (req, res) => {
    const user = req.session.user;
    if (!user) return res.redirect('/login');
  
    // Kirim ulang email verifikasi di sini (misalnya menggunakan nodemailer)
    try {
      // await sendVerificationEmail(user.email, token);
      req.flash('success', 'Verification link sent!');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Failed to send verification link.');
    }
  
    return res.redirect('/email/verify');
  };
  