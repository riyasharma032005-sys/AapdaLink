const EmergencyRequest = require('../models/EmergencyRequest');
const Notification = require('../models/Notification');
const User = require('../models/User');

const createEmergencyRequest = async (req, res) => {
  try {
    const {
      title,
      emergencyType,
      description,
      numberOfPeopleAffected,
      priority,
      address,
      contactPhone,
      latitude,
      longitude
    } = req.body;

    let imageUrl = '';
    if (req.file) {
      imageUrl = '/uploads/' + req.file.filename;
    }

    const lat = Number(latitude) || 19.0760;
    const lng = Number(longitude) || 72.8777;

    const newRequest = await EmergencyRequest.create({
      citizen: req.user._id,
      title,
      emergencyType,
      description,
      numberOfPeopleAffected: Number(numberOfPeopleAffected) || 1,
      priority: priority || 'High',
      status: 'Pending',
      address,
      contactPhone: contactPhone || req.user.phone,
      imageUrl,
      location: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      statusHistory: [
        {
          status: 'Pending',
          updatedBy: req.user._id,
          comment: 'Emergency request submitted by citizen.'
        }
      ]
    });

    await newRequest.populate('citizen', 'name email phone');

    const io = req.app.get('socketio');
    if (io) {
      io.emit('newEmergencyRequest', newRequest);
    }

    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Create Request Error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getEmergencyRequests = async (req, res) => {
  try {
    const { status, emergencyType, priority, search } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }
    if (emergencyType && emergencyType !== 'all') {
      query.emergencyType = emergencyType;
    }
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    const requests = await EmergencyRequest.find(query)
      .populate('citizen', 'name phone email')
      .populate('assignedTo', 'name phone role organizationName')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const requests = await EmergencyRequest.find({ citizen: req.user._id })
      .populate('assignedTo', 'name phone role organizationName')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAssignedRequests = async (req, res) => {
  try {
    const requests = await EmergencyRequest.find({ assignedTo: req.user._id })
      .populate('citizen', 'name phone email address')
      .sort({ updatedAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRequestById = async (req, res) => {
  try {
    const request = await EmergencyRequest.findById(req.params.id)
      .populate('citizen', 'name phone email')
      .populate('assignedTo', 'name phone role organizationName')
      .populate('statusHistory.updatedBy', 'name role');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const acceptRequest = async (req, res) => {
  try {
    const request = await EmergencyRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({ message: 'Request is already ' + request.status });
    }

    request.assignedTo = req.user._id;
    request.assignedRole = req.user.role;
    request.status = 'In Progress';
    request.statusHistory.push({
      status: 'In Progress',
      updatedBy: req.user._id,
      comment: 'Request accepted by ' + req.user.name + ' (' + req.user.role.toUpperCase() + ')'
    });

    await request.save();
    await request.populate('citizen', 'name phone email');
    await request.populate('assignedTo', 'name phone role organizationName');

    await Notification.create({
      recipient: request.citizen._id,
      sender: req.user._id,
      title: 'Help is on the way!',
      message: 'Your emergency request ' + request.title + ' has been accepted by ' + req.user.name,
      type: 'assignment',
      relatedRequest: request._id
    });

    const io = req.app.get('socketio');
    if (io) {
      io.emit('requestStatusUpdated', request);
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { status, comment } = req.body;
    const request = await EmergencyRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (req.user.role === 'citizen') {
      if (request.citizen.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to change this request' });
      }
      if (status !== 'Cancelled') {
        return res.status(400).json({ message: 'Citizen can only cancel their request' });
      }
    }

    request.status = status;
    request.statusHistory.push({
      status,
      updatedBy: req.user._id,
      comment: comment || ('Status changed to ' + status)
    });

    await request.save();
    await request.populate('citizen', 'name phone email');
    await request.populate('assignedTo', 'name phone role organizationName');

    await Notification.create({
      recipient: request.citizen._id,
      sender: req.user._id,
      title: 'Request Status: ' + status,
      message: 'Emergency request ' + request.title + ' status was updated to ' + status,
      type: 'status_update',
      relatedRequest: request._id
    });

    const io = req.app.get('socketio');
    if (io) {
      io.emit('requestStatusUpdated', request);
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEmergencyRequest,
  getEmergencyRequests,
  getMyRequests,
  getAssignedRequests,
  getRequestById,
  acceptRequest,
  updateRequestStatus
};
