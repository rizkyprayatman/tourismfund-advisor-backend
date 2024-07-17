const express = require('express');
const router = express.Router();
const visitController = require('../controllers/visitController');
const upload = require('../middlewares/upload');
const { authenticateAdmin } = require('../middlewares/authMiddleware');

router.post('/register', upload("file").single('file'), visitController.registerVisit);

router.put('/:id', authenticateAdmin, visitController.updateVisit);

router.put('/reject/:id', authenticateAdmin, visitController.rejectVisit);

router.put('/finish/:id', authenticateAdmin, visitController.finishVisit);

router.get('/all', authenticateAdmin, visitController.getAllVisits);

module.exports = router;