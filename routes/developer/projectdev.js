const express = require('express');
const router = express.Router();
const projectDeveloperController = require('../../controllers/dashboard/developer/projectDeveloperController');
const multer = require('multer');
const path = require('path');

router.get('/', projectDeveloperController.index);

router.post('/update/:id', (req, res, next) => {
  upload.single('logo_project')(req, res, (err) => {
    if (err) {
      req.flash('error', err.message || 'Upload failed, Only image files are allowed!');
      req.flash('old', req.body);
      return res.redirect('/dashboard-developer/project');
    }
    next();
  });
}, projectDeveloperController.update);

router.get('/detail/:name', projectDeveloperController.showByName);

module.exports = router;
