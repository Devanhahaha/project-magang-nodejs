const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/dashboard/aboutController');
const multer = require('multer');
const path = require('path');

// Konfigurasi upload gambar
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/dashboard/storage/files/about'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
  }),
  limits: { fileSize: 2 * 1024 * 1024 }, // max 2MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = ['.jpeg', '.jpg', '.png', '.gif', '.svg'];
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only image files are allowed!'));
  }
});

// Route
router.get('/', aboutController.index);
router.post('/update/:id', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      req.flash('error', err.message || 'Upload failed, Only image files are allowed!');
      req.flash('old', req.body);
      return res.redirect('/dashboard/about');
    }
    next();
  });
}, aboutController.update);

module.exports = router;
