
const express = require('express');
const router = express.Router();

const equipmentController =
  require('../Controller/equipmentController');

// GET all equipment
router.get('/', equipmentController.getAllEquipment);

module.exports = router;
