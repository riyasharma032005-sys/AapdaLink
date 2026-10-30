const express = require('express');
const router = express.Router();
const { getResources, createResource, updateResource, deleteResource } = require('../controllers/resourceController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getResources)
  .post(protect, authorize('ngo', 'admin'), createResource);

router.route('/:id')
  .put(protect, authorize('ngo', 'admin'), updateResource)
  .delete(protect, authorize('ngo', 'admin'), deleteResource);

module.exports = router;
