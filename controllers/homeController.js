const Home = require('../models/Home');
const fs = require('fs');
const path = require('path');

function validateNewsInput({ banner, title, subtitle, }, isUpdate = false) {
  const errors = [];

  // Image
  if (!isUpdate && !banner) {
    errors.push('Banner is required.');
  }

   // Vision
   if (!title || typeof title !== 'string' || title.length < 10 || title.length > 1000) {
    errors.push('Title must be between 10 and 1000 characters.');
  }

  // Description
  if (!subtitle || typeof subtitle !== 'string' || subtitle.length < 10 || subtitle.length > 1000) {
    errors.push('Subtitle must be between 10 and 1000 characters.');
  }

  return errors;
}

exports.index = async (req, res) => {
  try {
    const homes = await Home.findOne({ order: [['createdAt', 'DESC']] });
    res.render('adminpage/home/index', {
      homes,
      layout: 'layouts/main',
      title: 'Home'
    });
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
};

exports.update = async (req, res) => {
  try {
    const { title, subtitle } = req.body;
    const { id } = req.params;
    const banner = req.file;

    if (!banner || !title || !subtitle) {
      req.flash('error', 'All fields are required');
      req.flash('old', req.body);
      return res.redirect('/home');
    }

    const errors = validateNewsInput({ banner: banner || 'dummy.jpg', title, subtitle, }, true);
    if (errors.length > 0) {
      req.flash('error', errors);
      req.flash('old', { ...req.body, id });
      return res.redirect('/home');
    }

    const home = await Home.findByPk(id);
    if (!home) throw new Error('Home content not found');

    // Hapus file lama jika ada
    if (home.banner) {
      const oldPath = path.join('public', home.banner.replace('storage/', 'files/'));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    home.title = title;
    home.subtitle = subtitle;
    home.banner = 'storage/files/banner/' + banner.filename;

    await home.save();
    req.flash('success', 'Home content updated successfully!');
    res.redirect('/home');
  } catch (err) {
    req.flash('error', 'Failed to update: ' + err.message);
    req.flash('old', req.body);
    res.redirect('/home');
  }
};
