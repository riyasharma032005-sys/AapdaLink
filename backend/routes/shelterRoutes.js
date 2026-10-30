const express = require('express');
const router = express.Router();
const { getShelters, createShelter, updateShelter, deleteShelter } = require('../controllers/shelterController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getShelters)
  .post(protect, authorize('ngo', 'admin'), createShelter);

router.route('/:id')
  .put(protect, authorize('ngo', 'admin'), updateShelter)
  .delete(protect, authorize('ngo', 'admin'), deleteShelter);

module.exports = router;
