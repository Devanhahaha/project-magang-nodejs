const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const upload = require('../middleware/multer');

router.get('/', newsController.index);

router.post('/store', (req, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        req.flash('error', err.message || 'Upload failed, Only image files are allowed!');
        req.flash('old', req.body);
        return res.redirect('/news');
      }
      next();
    });
  }, newsController.store);

router.post('/update/:id', (req, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        req.flash('error', err.message || 'Upload failed, Only image files are allowed!');
        req.flash('old', req.body);
        return res.redirect('/news');
      }
      next();
    });
  }, newsController.update);

router.post('/delete/:id', newsController.destroy);
router.get('/detail/:slug', newsController.showBySlug);

module.exports = router;