const Resource = require('../models/Resource');

// @desc    Get all resources (can filter by category or status)
// @route   GET /api/resources
// @access  Public / Protected
const getResources = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    let query = {};
    if (category && category !== 'all') query.category = category;
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { itemName: { $regex: search, $options: 'i' } },
        { warehouseLocation: { $regex: search, $options: 'i' } }
      ];
    }
    const resources = await Resource.find(query).populate('ngo', 'name organizationName phone email').sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new resource
// @route   POST /api/resources
// @access  Private (NGO/Admin)
const createResource = async (req, res) => {
  try {
    const { category, itemName, quantity, unit, warehouseLocation, notes, status } = req.body;
    const resource = await Resource.create({
      ngo: req.user._id,
      category,
      itemName,
      quantity: Number(quantity),
      unit,
      warehouseLocation,
      notes: notes || '',
      status: status || 'Available'
    });
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update resource
// @route   PUT /api/resources/:id
// @access  Private (NGO/Admin)
const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    
    // Check ownership if not admin
    if (req.user.role !== 'admin' && resource.ngo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this resource' });
    }

    const updated = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete resource
// @route   DELETE /api/resources/:id
// @access  Private (NGO/Admin)
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    if (req.user.role !== 'admin' && resource.ngo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this resource' });
    }

    await resource.deleteOne();
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getResources, createResource, updateResource, deleteResource };
