// === controllers/servicesController.js ===
const path = require('path');
const fs = require('fs');
const Services = require('../models/Services');
const validator = require('validator');
const slugify = require('slugify');

function validateNewsInput({ banner, title, subtitle, description }, isUpdate = false) {
    const errors = [];
  
    // Image
    if (!isUpdate && !banner) {
      errors.push('Image is required.');
    }
  
    // Title
    const titleRegex = /^[a-zA-Z0-9\s.,\-_\(\)&']+$/;
    if (!title || typeof title !== 'string' || title.length < 5 || title.length > 255 || !titleRegex.test(title)) {
      errors.push('Title must be 5-255 characters and match allowed characters.');
    }

    // Category
    if (!subtitle || typeof subtitle !== 'string' || subtitle.length > 255) {
        errors.push('subtitle must be a string and max 255 characters.');
      }
  
    // Description
    if (!description || typeof description !== 'string' || description.length < 10 || description.length > 1000) {
      errors.push('Description must be between 10 and 1000 characters.');
    }
  
    return errors;
  }

function stripHTML(input) {
  return input.replace(/<[^>]*>?/gm, '');
}

exports.index = async (req, res) => {
  try {
    const services = await Services.findAll({ order: [['id', 'DESC']] });

    const servicesWithPreview = services.map((item) => {
      return {
        ...item.toJSON(), // Convert Sequelize instance ke plain object
        descPreview: stripHTML(item.description),
      };
    });

    res.render('adminpage/services/index', {
      layout: 'layouts/main',
      title: 'Services',
      services: servicesWithPreview,
    });
  } catch (err) {
    req.flash('error', 'Failed to load services');
    res.redirect('/dashboard');
  }
};

exports.store = async (req, res) => {
    try {
      const { title, subtitle, description } = req.body;
      
      const slug = slugify(req.body.title, { lower: true, strict: true });
      // hasil: Ramahtech WEB → ramahtech-web

      const banner = req.file; // ✅ Tambahkan ini
  
      const errors = validateNewsInput({ banner, title, description, subtitle });
      if (errors.length > 0) {
        req.flash('error', errors);
        req.flash('old', req.body);
        return res.redirect('/services');
      }
  
      await Services.create({
        banner: banner.filename,
        title,
        subtitle,
        slug,
        description
      });
  
      req.flash('success', 'Services Content created successfully!');
      res.redirect('/services');
    } catch (err) {
      req.flash('error', 'Failed to create Services Content: ' + err.message);
      res.redirect('/services');
    }
  };

  exports.showBySlug = async (req, res) => {
    try {
      const { slug } = req.params;
      const service = await Services.findOne({ where: { slug } });
  
      if (!service) throw new Error('Service not found');
  
      res.render('adminpage/services/detail', {
        layout: 'layouts/main',
        title: 'Detail Service',
        service,
      });
    } catch (err) {
      req.flash('error', 'Failed to load service details: ' + err.message);
      res.redirect('/services');
    }
  };  
  
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description } = req.body;
    const slug = slugify(req.body.title, { lower: true, strict: true });
    const service = await Services.findByPk(id);
    if (!service) throw new Error('Service not found');

    const banner = req.file; // ✅ deklarasi dulu
    const errors = validateNewsInput({ banner: banner || 'dummy.jpg', title, description, subtitle }, true);

    if (errors.length > 0) {
      req.flash('error', errors);
      req.flash('old', { ...req.body, id });
      return res.redirect('/services');
    }

    if (req.file) {
      const oldPath = path.join(__dirname, '../public', service.banner);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      service.banner = req.file.filename;
    }

    service.title = title;
    service.subtitle = subtitle;
    service.description = description;
    service.slug = slug;

    await service.save();
    req.flash('success', 'Services Content updated successfully!');
    res.redirect('/services');
  } catch (err) {
    req.flash('error', 'Failed to update Services Content: ' + err.message);
    res.redirect('/services');
  }
};

exports.destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Services.findByPk(id);
    if (!service) throw new Error('Service not found');

    const oldPath = path.join(__dirname, '../public', service.banner);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

    await service.destroy();
    req.flash('success', 'Services Content deleted successfully!');
    res.redirect('/services');
  } catch (err) {
    req.flash('error', 'Failed to delete Services Content: ' + err.message);
    res.redirect('/services');
  }
};
