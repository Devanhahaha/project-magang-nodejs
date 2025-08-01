const express = require('express');
const router = express.Router();
const projectQaController = require('../../controllers/dashboard/qualityassurance/projectQaController');
const multer = require('multer');
const path = require('path');

router.get('/', projectQaController.index);

router.post('/update/:id', (req, res, next) => {
  upload.single('logo_project')(req, res, (err) => {
    if (err) {
      req.flash('error', err.message || 'Upload failed, Only image files are allowed!');
      req.flash('old', req.body);
      return res.redirect('/dashboard-qa/project-qa');
    }
    next();
  });
}, projectQaController.update);

router.get('/detail/:name', projectQaController.showByName);

module.exports = router;
