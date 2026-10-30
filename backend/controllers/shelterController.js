const Shelter = require('../models/Shelter');

// @desc    Get all shelters
// @route   GET /api/shelters
// @access  Public / Protected
const getShelters = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }
    const shelters = await Shelter.find(query).populate('ngo', 'name organizationName phone email').sort({ createdAt: -1 });
    res.json(shelters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new shelter
// @route   POST /api/shelters
// @access  Private (NGO/Admin)
const createShelter = async (req, res) => {
  try {
    const { name, address, latitude, longitude, capacity, currentOccupancy, contactPerson, contactPhone, amenities, status } = req.body;
    
    const lat = Number(latitude) || 19.0760;
    const lng = Number(longitude) || 72.8777;

    const shelter = await Shelter.create({
      ngo: req.user._id,
      name,
      address,
      location: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      capacity: Number(capacity),
      currentOccupancy: Number(currentOccupancy) || 0,
      contactPerson,
      contactPhone,
      amenities: Array.isArray(amenities) ? amenities : (amenities ? amenities.split(',').map(s => s.trim()) : []),
      status: status || 'Open'
    });

    res.status(201).json(shelter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update shelter
// @route   PUT /api/shelters/:id
// @access  Private (NGO/Admin)
const updateShelter = async (req, res) => {
  try {
    const shelter = await Shelter.findById(req.params.id);
    if (!shelter) return res.status(404).json({ message: 'Shelter not found' });

    if (req.user.role !== 'admin' && shelter.ngo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this shelter' });
    }

    const { latitude, longitude, amenities } = req.body;
    const updateData = { ...req.body };

    if (latitude !== undefined && longitude !== undefined) {
      updateData.location = {
        type: 'Point',
        coordinates: [Number(longitude), Number(latitude)]
      };
    }

    if (amenities && typeof amenities === 'string') {
      updateData.amenities = amenities.split(',').map(s => s.trim());
    }

    const updated = await Shelter.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete shelter
// @route   DELETE /api/shelters/:id
// @access  Private (NGO/Admin)
const deleteShelter = async (req, res) => {
  try {
    const shelter = await Shelter.findById(req.params.id);
    if (!shelter) return res.status(404).json({ message: 'Shelter not found' });

    if (req.user.role !== 'admin' && shelter.ngo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this shelter' });
    }

    await shelter.deleteOne();
    res.json({ message: 'Shelter deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getShelters, createShelter, updateShelter, deleteShelter };
