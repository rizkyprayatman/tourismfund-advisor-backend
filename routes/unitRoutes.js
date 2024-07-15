const express = require('express');
const router = express.Router();
const unitController = require('../controllers/unitController');
const { authenticateAdmin } = require('../middlewares/authMiddleware');

router.get('/', authenticateAdmin, unitController.getAllUnits);
router.get('/:id', authenticateAdmin, unitController.getUnitById);
router.post('/', authenticateAdmin, unitController.addUnit);
router.put('/:id', authenticateAdmin, unitController.updateUnit);
router.delete('/:id', authenticateAdmin, unitController.deleteUnit);

module.exports = router;