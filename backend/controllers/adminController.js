const User = require('../models/User');
const EmergencyRequest = require('../models/EmergencyRequest');
const Resource = require('../models/Resource');
const Shelter = require('../models/Shelter');

// @desc    Get dashboard statistics for Admin
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCitizens = await User.countDocuments({ role: 'citizen' });
    const totalVolunteers = await User.countDocuments({ role: 'volunteer' });
    const totalNGOs = await User.countDocuments({ role: 'ngo' });

    const totalRequests = await EmergencyRequest.countDocuments();
    const pendingRequests = await EmergencyRequest.countDocuments({ status: 'Pending' });
    const inProgressRequests = await EmergencyRequest.countDocuments({ status: 'In Progress' });
    const completedRequests = await EmergencyRequest.countDocuments({ status: 'Completed' });

    const totalShelters = await Shelter.countDocuments();
    const shelters = await Shelter.find();
    const totalCapacity = shelters.reduce((acc, s) => acc + (s.capacity || 0), 0);
    const totalOccupancy = shelters.reduce((acc, s) => acc + (s.currentOccupancy || 0), 0);

    const totalResources = await Resource.countDocuments();

    // Group requests by emergencyType
    const requestsByType = await EmergencyRequest.aggregate([
      { $group: { _id: '$emergencyType', count: { $sum: 1 } } }
    ]);

    res.json({
      users: {
        total: totalUsers,
        citizens: totalCitizens,
        volunteers: totalVolunteers,
        ngos: totalNGOs
      },
      requests: {
        total: totalRequests,
        pending: pendingRequests,
        inProgress: inProgressRequests,
        completed: completedRequests,
        byType: requestsByType
      },
      shelters: {
        total: totalShelters,
        capacity: totalCapacity,
        occupancy: totalOccupancy
      },
      resources: {
        total: totalResources
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users with role filtering
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    let query = {};
    if (role && role !== 'all') query.role = role;
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user verification or role
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
const updateUser = async (req, res) => {
  try {
    const { isVerified, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (isVerified !== undefined) user.isVerified = isVerified;
    if (role) user.role = role;

    await user.save();
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAdminStats, getAllUsers, updateUser, deleteUser };
