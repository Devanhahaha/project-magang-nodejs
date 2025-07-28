const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const portofolioController = require('../controllers/dashboard/portofolioController');

// Setup multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/dashboard/storage/files/portofolio');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.gif', '.svg'].includes(ext)) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  },
});

router.get('/', portofolioController.index);

router.post('/store', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      req.flash('error', err.message || 'Upload failed, Only image files are allowed!');
      req.flash('old', req.body);
      return res.redirect('/dashboard/portofolio');
    }
    next();
  });
}, portofolioController.store);

router.post('/update/:id', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      req.flash('error', err.message || 'Upload failed, Only image files are allowed!');
      req.flash('old', req.body);
      return res.redirect('/dashboard/portofolio');
    }
    next();
  });
}, portofolioController.update);

router.post('/delete/:id', portofolioController.destroy);
router.get('/detail/:slug', portofolioController.showBySlug);

module.exports = router;