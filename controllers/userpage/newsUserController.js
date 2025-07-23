const News = require('../../models/News');
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

// exports.index = async (req, res) => {
//   try {
//     const search = req.query.search;
//     const whereClause = {
//       user_id: req.session.user.id
//     };
//     if (search) {
//       const { Op } = require('sequelize');
//       whereClause[Op.or] = [
//         { category: { [Op.iLike]: `%${search}%` } },
//         { title: { [Op.iLike]: `%${search}%` } }, // opsional
//       ];
//     }
//     const news = await News.findAll({
//       where: whereClause,
//       order: [['id', 'DESC']],
//     });
//     res.render('userpage/news/index', {
//       title: 'News',
//       news,
//       layout: 'userpage/layouts/main',
//       search, 
//     });
//   } catch (error) {
//     req.flash('error', 'Failed to load news');
//     res.redirect('/dashboard-user');
//   }
// };

exports.index = async (req, res) => {
  try {
    const { search, page = 1, limit = 5 } = req.query; 
    const offset = (page - 1) * limit;

    const { Op } = require('sequelize');
    const whereClause = {
      user_id: req.session.user.id,
    };
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

    res.render('userpage/news/index', {
      title: 'News',
      news: rows,
      currentPage: parseInt(page),
      totalPages,
      search,
      layout: 'userpage/layouts/main',
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to load news');
    res.redirect('/dashboard-user');
  }
};

exports.store = async (req, res) => {
  try {
    const { category, title, description, tanggal } = req.body;
    const slug = slugify(req.body.title, { lower: true, strict: true });
    const image = req.file;

    const errors = validateNewsInput({ image, category, title, description, tanggal });
    if (errors.length > 0) {
      req.flash('error', errors);
      req.flash('old', req.body);
      return res.redirect('/news-user');
    }

    await News.create({
      user_id: req.session.user.id,
      image: 'storage/files/news/' + image.filename,
      category,
      title,
      description,
      tanggal,
      slug,
    });

    req.flash('success', 'News Content created successfully!');
    res.redirect('/news-user');
  } catch (error) {
    req.flash('error', 'Failed to create news: ' + error.message);
    req.flash('old', req.body);
    res.redirect('/news-user');
  }
};

exports.showBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const news = await News.findOne({ where: { slug } });

    if (!news) throw new Error('News not found');

    res.render('userpage/news/detail', {
      layout: 'userpage/layouts/main',
      title: 'Detail News',
      news,
    });
  } catch (err) {
    req.flash('error', 'Failed to load news details: ' + err.message);
    res.redirect('/news-user');
  }
};  

exports.update = async (req, res) => {
  try {
    const { category, title, description, tanggal } = req.body;
    const slug = slugify(req.body.title, { lower: true, strict: true });
    const image = req.file;
    const { id } = req.params;

    const news = await News.findOne({
      where: {
        id,
        user_id: req.session.user.id, 
      },
    });
    if (!news) throw new Error('News not found or not authorized.');
    

    const errors = validateNewsInput({ image: image || 'dummy.jpg', category, title, description, tanggal }, true);
    if (errors.length > 0) {
      req.flash('error', errors);
      req.flash('old', { ...req.body, id });
      return res.redirect('/news-user');
    }

    if (image) {
      const oldPath = path.join('public', news.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      news.image = 'storage/files/news/' + image.filename;
    }

    news.category = category;
    news.title = title;
    news.description = description;
    news.tanggal = tanggal;
    news.slug = slug;

    await news.save();

    req.flash('success', 'News Content updated successfully!');
    res.redirect('/news-user');
  } catch (error) {
    req.flash('error', 'Failed to update news: ' + error.message);
    req.flash('old', { ...req.body, id: req.params.id });
    res.redirect('/news-user');
  }
};

exports.destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findOne({
      where: {
        id,
        user_id: req.session.user.id, // ✅ pastikan hanya berita miliknya
      },
    });
    if (!news) throw new Error('News not found or not authorized.');
    
    const imagePath = path.join('public', news.image);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    await news.destroy();
    req.flash('success', 'News Content deleted successfully!');
    res.redirect('/news-user');
  } catch (error) {
    req.flash('error', 'Failed to delete news: ' + error.message);
    res.redirect('/news-user');
  }
};
