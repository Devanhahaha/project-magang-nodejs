const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const multer = require('multer');
const path = require('path');

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/storage/files/banner'),
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
router.get('/', homeController.index);
router.post('/update/:id', (req, res, next) => {
  upload.single('banner')(req, res, (err) => {
    if (err) {
      req.flash('error', err.message || 'Upload failed, Only image files are allowed!');
      req.flash('old', req.body);
      return res.redirect('/home');
    }
    next();
  });
}, homeController.update);


module.exports = router;
