// === controllers/portofolioController.js ===
const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const Portofolio = require('../../models/dashboard/Portofolio');
const validator = require('validator');
const slugify = require('slugify');

function stripHTML(input) {
  return input.replace(/<[^>]*>?/gm, '');
}

exports.index = async (req, res) => {
  try {
    const { search, page = 1, limit = 5 } = req.query; 
    const offset = (page - 1) * limit;

    const { Op } = require('sequelize');
    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { category: { [Op.iLike]: `%${search}%` } },
        { title: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Portofolio.findAndCountAll({
      where: whereClause,
      order: [['id', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const portofoliosWithPreview = rows.map((item) => {
      return {
        ...item.toJSON(),
        descPreview: stripHTML(item.description),
      };
    });

    const totalPages = Math.ceil(count / limit);

    res.render('dashboard/adminpage/portofolio/index', {
      title: 'Portofolio',
      portofolios: portofoliosWithPreview,
      currentPage: parseInt(page),
      totalPages,
      search,
      layout: 'dashboard/layouts/main',
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to load portofolio: ' + error.message);
    res.redirect('/dashboard');
  }
};

exports.showBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const portofolio = await Portofolio.findOne({ where: { slug } });

    if (!portofolio) throw new Error('Portofolio not found');

    res.render('dashboard/adminpage/portofolio/detail', {
      layout: 'dashboard/layouts/main',
      title: 'Detail Portofolio',
      portofolio,
    });
  } catch (err) {
    req.flash('error', 'Failed to load portofolio details: ' + err.message);
    res.redirect('/dashboard/portofolio');
  }
};  

exports.store = async (req, res) => {
  const { category, title, description, tanggal, end_date, techstack } = req.body;
  const slug = slugify(req.body.title, { lower: true, strict: true });
  const image = req.file;
  const errors = [];

  if (!image) errors.push('Image is required');
  if (!category || category.length > 255) errors.push('Category required and max 255 chars');
  if (!title || title.length < 5 || title.length > 255) errors.push('Title must be 5-255 chars');
  if (!description || description.length < 10 || description.length > 1000) errors.push('Description must be 10-1000 chars');
  if (!validator.isDate(tanggal)) errors.push('Invalid date');
  if (!validator.isDate(end_date)) errors.push('Invalid date');
  if (!techstack || techstack.length < 10 || techstack.length > 1000) errors.push('Techstack must be 10-1000 chars');

  if (errors.length > 0) {
    req.flash('error', errors);
    req.flash('old', req.body);
    return res.redirect('/dashboard/portofolio');
  }

  try {
    await Portofolio.create({
      // Hanya simpan nama file-nya saja (tanpa path)
      image: image.filename,
      category,
      title,
      description,
      tanggal,
      end_date,
      techstack,
      slug,
    });    
    req.flash('success', 'Portofolio Content created successfully!');
    res.redirect('/dashboard/portofolio');
  } catch (err) {
    req.flash('error', 'Failed to create: ' + err.message);
    res.redirect('/dashboard/portofolio');
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { category, title, description, tanggal, end_date, techstack } = req.body;
  const slug = slugify(req.body.title, { lower: true, strict: true });
  const image = req.file;

  const errors = [];
  if (!category || category.length > 255) errors.push('Category required and max 255 chars');
  if (!title || title.length < 5 || title.length > 255) errors.push('Title must be 5-255 chars');
  if (!description || description.length < 10 || description.length > 1000) errors.push('Description must be 10-1000 chars');
  if (!validator.isDate(tanggal)) errors.push('Invalid date');
  if (!validator.isDate(end_date)) errors.push('Invalid date');
  if (!techstack || techstack.length < 10 || techstack.length > 1000) errors.push('Techstack must be 10-1000 chars');

  if (errors.length > 0) {
    req.flash('error', errors);
    req.flash('old', req.body);
    return res.redirect('/dashboard/portofolio');
  }

  try {
    const portofolio = await Portofolio.findByPk(id);
    if (!portofolio) throw new Error('Not found');

    if (image) {
      // Hapus gambar lama dari folder public
      const oldPath = path.join('public', portofolio.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    
      // Simpan hanya nama file-nya saja, bukan path
      portofolio.image = image.filename;
    }
    

    portofolio.category = category;
    portofolio.title = title;
    portofolio.description = description;
    portofolio.tanggal = tanggal;
    portofolio.end_date = end_date;
    portofolio.techstack = techstack;
    portofolio.slug = slug;

    await portofolio.save();
    req.flash('success', 'Portofolio Content updated successfully!');
    res.redirect('/dashboard/portofolio');
  } catch (err) {
    req.flash('error', 'Failed to update: ' + err.message);
    res.redirect('/dashboard/portofolio');
  }
};

exports.destroy = async (req, res) => {
  const { id } = req.params;
  try {
    const portofolio = await Portofolio.findByPk(id);
    if (!portofolio) throw new Error('Not found');

    const imagePath = path.join('public', portofolio.image);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    await portofolio.destroy();
    req.flash('success', 'Portofolio Content deleted successfully!');
    res.redirect('/dashboard/portofolio');
  } catch (err) {
    req.flash('error', 'Failed to delete: ' + err.message);
    res.redirect('/dashboard/portofolio');
  }
};