const express = require('express');
const router = express.Router();
const newsUserController = require('../controllers/dashboard/userpage/newsUserController');
const upload = require('../middleware/multer');

router.get('/', newsUserController.index);

router.post('/store', (req, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        req.flash('error', err.message || 'Upload failed, Only image files are allowed!');
        req.flash('old', req.body);
        return res.redirect('/dashboard-user/news-user');
      }
      next();
    });
  }, newsUserController.store);

router.post('/update/:id', (req, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        req.flash('error', err.message || 'Upload failed, Only image files are allowed!');
        req.flash('old', req.body);
        return res.redirect('/dashboard-user/news-user');
      }
      next();
    });
  }, newsUserController.update);

router.post('/delete/:id', newsUserController.destroy);
router.get('/detail/:slug', newsUserController.showBySlug);

module.exports = router;