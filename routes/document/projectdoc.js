const express = require('express');
const router = express.Router();
const projectDocController = require('../../controllers/dashboard/document/projectDocumentController');
const multer = require('multer');
const path = require('path');

router.get('/', projectDocController.index);

router.post('/update/:id', (req, res, next) => {
  upload.single('logo_project')(req, res, (err) => {
    if (err) {
      req.flash('error', err.message || 'Upload failed, Only image files are allowed!');
      req.flash('old', req.body);
      return res.redirect('/dashboard-document/project-document');
    }
    next();
  });
}, projectDocController.update);

router.get('/detail/:name', projectDocController.showByName);

module.exports = router;
