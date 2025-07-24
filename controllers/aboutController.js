const fs = require('fs');
const path = require('path');
const About = require('../models/About');
const validator = require('validator');

function validateNewsInput({ image, description, vision, mission, }, isUpdate = false) {
  const errors = [];

  // Image
  if (!isUpdate && !image) {
    errors.push('Image is required.');
  }

  // Description
  if (!description || typeof description !== 'string' || description.length < 10 || description.length > 1000) {
    errors.push('Description must be between 10 and 1000 characters.');
  }

  // Vision
  if (!vision || typeof vision !== 'string' || vision.length < 10 || vision.length > 1000) {
    errors.push('Vision must be between 10 and 1000 characters.');
  }

  // Mission
  if (!mission || typeof mission !== 'string' || mission.length < 10 || mission.length > 1000) {
    errors.push('Mission must be between 10 and 1000 characters.');
  }

  return errors;
}

exports.index = async (req, res) => {
  try {
    const about = await About.findOne({ order: [['createdAt', 'DESC']] });
    res.render('adminpage/about/index', { 
    about ,
    layout: 'layouts/main',
    title: 'About'
});
  } catch (error) {
    console.error(error);
    req.flash('error', 'Gagal memuat data.');
    res.redirect('/dashboard');
  }
};

exports.update = async (req, res) => {
  const { description, vision, mission } = req.body;
  const aboutId = req.params.id;
  const image = req.file;

  try {
    const about = await About.findByPk(aboutId);

    if (!about) {
      req.flash('error', 'Data tidak ditemukan.');
      return res.redirect('/about');
    }

    const errors = validateNewsInput({ image: image || 'dummy.jpg', description, vision, mission, }, true);
    if (errors.length > 0) {
      req.flash('error', errors);
      req.flash('old', { ...req.body, id });
      return res.redirect('/about');
    }

    // Hapus gambar lama
    if (req.file) {
      const oldPath = path.join(__dirname, '..', 'public', about.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

      about.image = `${req.file.filename}`;
    }

    about.description = description;
    about.vision = vision;
    about.mission = mission;

    await about.save();

    req.flash('success', 'About content successfully updated!');
    res.redirect('/about');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Gagal memperbarui konten.');
    res.redirect('/about');
  }
};
