const express = require('express');
const router = express.Router();
const pageController = require('../../controllers/homepage/pageController');

// Routes
router.get('/', pageController.home);
router.get('/profil', pageController.profile);
router.get('/services', pageController.services);
router.get('/portofolio', pageController.portofolio);
router.get('/news', pageController.news);
router.get('/news/read/:slug', pageController.getBeritaById);

module.exports = router;
