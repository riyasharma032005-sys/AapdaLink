import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { 
  AlertTriangle, 
  MapPin, 
  Phone, 
  Users, 
  Image, 
  CheckCircle, 
  Loader2, 
  Navigation,
  Check
} from 'lucide-react';

const CreateRequestModal = ({ isOpen, onClose, onRequestCreated }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    emergencyType: 'Rescue',
    description: '',
    numberOfPeopleAffected: 1,
    priority: 'High',
    address: '',
    contactPhone: user?.phone || '',
    latitude: 19.0760,
    longitude: 72.8777
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsSuccess, setGpsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setGpsLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
        setGpsLoading(false);
        setGpsSuccess(true);
        setTimeout(() => setGpsSuccess(false), 4000);
      },
      (err) => {
        console.warn('GPS location error:', err.message);
        setError('Could not get automatic GPS. Defaulting to regional coordinates.');
        setGpsLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });

      if (imageFile) {
        data.append('image', imageFile);
      }

      const res = await API.post('/requests', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (onRequestCreated) {
        onRequestCreated(res.data);
      }
      onClose();
    } catch (err) {
      console.error('Request creation error:', err);
      setError(err.response?.data?.message || 'Failed to submit emergency request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="w-6 h-6" />
            <h2 className="text-lg font-bold text-slate-900">Report Emergency SOS</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-700 text-xl font-bold"
          >
            &times;
          </button>
        </div>

        {error && (
          <div className="my-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Emergency Type Selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Emergency Type *</label>
            <div className="grid grid-cols-3 gap-2">
              {['Rescue', 'Food', 'Water', 'Medicine', 'Shelter', 'Other'].map(type => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setFormData(prev => ({ ...prev, emergencyType: type }))}
                  className={`py-2 text-center rounded-lg font-semibold border transition ${
                    formData.emergencyType === type
                      ? 'bg-red-600 text-white border-red-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Emergency Title / Subject *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. 5 people stranded on rooftop due to flood"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Detailed Description *</label>
            <textarea
              name="description"
              required
              rows="3"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Explain the urgency, conditions, obstacles, medical requirements..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
            ></textarea>
          </div>

          {/* People affected & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">People Affected</label>
              <input
                type="number"
                name="numberOfPeopleAffected"
                min="1"
                value={formData.numberOfPeopleAffected}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Urgency Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none bg-white"
              >
                <option value="Critical">🚨 Critical (Life Threatening)</option>
                <option value="High">⚠️ High Priority</option>
                <option value="Medium">⚡ Medium</option>
                <option value="Low">ℹ️ Low</option>
              </select>
            </div>
          </div>

          {/* Location address */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Detailed Landmark / Address *</label>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Building name, street, nearby shop, landmark"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          {/* GPS Coordinates & Auto detect */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                <span>GPS Location Coordinates</span>
              </span>
              <button
                type="button"
                onClick={handleFetchCurrentLocation}
                disabled={gpsLoading}
                className="text-[11px] font-semibold text-red-600 hover:text-red-700 flex items-center space-x-1"
              >
                {gpsLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : gpsSuccess ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Navigation className="w-3 h-3" />
                )}
                <span>{gpsLoading ? 'Fetching...' : gpsSuccess ? 'GPS Locked!' : 'Detect My GPS'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-500">Latitude</span>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-slate-700"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500">Longitude</span>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Phone & Photo */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Phone *</label>
              <input
                type="text"
                name="contactPhone"
                required
                value={formData.contactPhone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Attach Photo (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-[11px] file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
              />
            </div>
          </div>

          {imagePreview && (
            <div className="w-full h-24 rounded-lg overflow-hidden border border-slate-200">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md shadow-red-200 flex items-center justify-center space-x-2 transition text-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting SOS...</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  <span>Broadcast Emergency SOS</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRequestModal;
