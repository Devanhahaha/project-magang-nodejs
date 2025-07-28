const News = require('../../models/dashboard/News');
const fs = require('fs');
const path = require('path');
const validator = require('validator');
const slugify = require('slugify');

function validateNewsInput({ image, category, title, description, tanggal }, isUpdate = false) {
  const errors = [];

  // Image
  if (!isUpdate && !image) {
    errors.push('Image is required.');
  }

  // Category
  if (!category || typeof category !== 'string' || category.length > 255) {
    errors.push('Category must be a string and max 255 characters.');
  }

  // Title
  const titleRegex = /^[a-zA-Z0-9\s.,\-_\(\)&']+$/;
  if (!title || typeof title !== 'string' || title.length < 5 || title.length > 255 || !titleRegex.test(title)) {
    errors.push('Title must be 5-255 characters and match allowed characters.');
  }

  // Description
  if (!description || typeof description !== 'string' || description.length < 10 || description.length > 1000) {
    errors.push('Description must be between 10 and 1000 characters.');
  }

  // Tanggal
  if (!validator.isDate(tanggal, { format: 'YYYY-MM-DD', strictMode: true })) {
    errors.push('Tanggal must be a valid date in YYYY-MM-DD format.');
  }

  return errors;
}

exports.index = async (req, res) => {
  try {
    const { search, page = 1, limit = 5 } = req.query; // default page 1, limit 5
    const offset = (page - 1) * limit;

    const { Op } = require('sequelize');
    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { category: { [Op.iLike]: `%${search}%` } },
        { title: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await News.findAndCountAll({
      where: whereClause,
      order: [['id', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const totalPages = Math.ceil(count / limit);

    res.render('dashboard/adminpage/news/index', {
      title: 'News',
      news: rows,
      currentPage: parseInt(page),
      totalPages,
      search,
      layout: 'dashboard/layouts/main',
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to load news');
    res.redirect('/dashboard');
  }
};

exports.store = async (req, res) => {
  try {
    const { category, title, description, tanggal } = req.body;
    const slug = slugify(req.body.title, { lower: true, strict: true });
    const image = req.file;

    console.log('Uploaded file:', image); // ⬅️ pindahkan ke sini

    const errors = validateNewsInput({ image, category, title, description, tanggal });
    if (errors.length > 0) {
      req.flash('error', errors);
      req.flash('old', req.body);
      return res.redirect('/dashboard/news');
    }

    await News.create({
      image: image.filename,
      category,
      title,
      description,
      tanggal,
      slug,
    });

    req.flash('success', 'News Content created successfully!');
    res.redirect('/dashboard/news');
  } catch (error) {
    req.flash('error', 'Failed to create news: ' + error.message);
    req.flash('old', req.body);
    res.redirect('/dashboard/news');
  }
};

exports.showBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const news = await News.findOne({ where: { slug } });

    if (!news) throw new Error('News not found');

    res.render('dashboard/adminpage/news/detail', {
      layout: 'dashboard/layouts/main',
      title: 'Detail News',
      news,
    });
  } catch (err) {
    req.flash('error', 'Failed to load news details: ' + err.message);
    res.redirect('/dashboard/news');
  }
};  

exports.update = async (req, res) => {
  try {
    const { category, title, description, tanggal } = req.body;
    const slug = slugify(req.body.title, { lower: true, strict: true });
    const image = req.file;
    const { id } = req.params;

    const news = await News.findByPk(id);
    if (!news) throw new Error('News not found.');

    const errors = validateNewsInput(
      { image: image ? image.filename : news.image, category, title, description, tanggal },
      true
    );

    if (errors.length > 0) {
      req.flash('error', errors);
      req.flash('old', { ...req.body, id });
      return res.redirect('/dashboard/news');
    }

    if (image) {
      // Hapus file lama jika ada
      const oldPath = path.join('public', news.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

      // Hanya jika ada gambar baru, update field image
      news.image = image.filename;
    }

    // Update field lainnya
    news.category = category;
    news.title = title;
    news.description = description;
    news.tanggal = tanggal;
    news.slug = slug;

    await news.save();

    req.flash('success', 'News Content updated successfully!');
    res.redirect('/dashboard/news');
  } catch (error) {
    req.flash('error', 'Failed to update news: ' + error.message);
    req.flash('old', { ...req.body, id: req.params.id });
    res.redirect('/dashboard/news');
  }
};

exports.destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findByPk(id);
    if (!news) throw new Error('News not found');

    const imagePath = path.join('public', news.image);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    await news.destroy();
    req.flash('success', 'News Content deleted successfully!');
    res.redirect('/dashboard/news');
  } catch (error) {
    req.flash('error', 'Failed to delete news: ' + error.message);
    res.redirect('/dashboard/news');
  }
};
