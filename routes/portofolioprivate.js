const express = require('express');
const router = express.Router();
const portofolioPrivateController = require('../controllers/dashboard/portofolioprivateController');

router.get('/', portofolioPrivateController.index);

module.exports = router;