const express = require('express');
const router = express.Router();
const settingsUserController = require('../controllers/userpage/settingsUserController');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => cb(null, 'public/storage/files/components'),
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

router.get('/', authMiddleware, settingsUserController.index);

router.post('/update/:id', (req, res, next) => {
    upload.single('logo_apk')(req, res, (err) => {
      if (err) {
        req.flash('error', err.message || 'Upload failed, Only image files are allowed!');
        req.flash('old', req.body);
        return res.redirect('/settings-user');
      }
      next();
    });
  }, authMiddleware, settingsUserController.update);

module.exports = router;
