const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const {
  createEmergencyRequest,
  getEmergencyRequests,
  getMyRequests,
  getAssignedRequests,
  getRequestById,
  acceptRequest,
  updateRequestStatus
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getEmergencyRequests)
  .post(protect, upload.single('image'), createEmergencyRequest);

router.get('/my-requests', protect, getMyRequests);
router.get('/assigned', protect, authorize('volunteer', 'ngo', 'admin'), getAssignedRequests);

router.route('/:id')
  .get(getRequestById);

router.put('/:id/accept', protect, authorize('volunteer', 'ngo', 'admin'), acceptRequest);
router.put('/:id/status', protect, updateRequestStatus);

module.exports = router;
