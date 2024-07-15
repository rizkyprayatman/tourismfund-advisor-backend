const express = require('express');
const router = express.Router();
const visitController = require('../controllers/visitController');
const upload = require('../middlewares/upload');
const { authenticateAdmin } = require('../middlewares/authMiddleware');

router.post('/register', upload("file").single('file'), visitController.registerVisit);

router.put('/:id', authenticateAdmin, visitController.updateVisit);

module.exports = router;