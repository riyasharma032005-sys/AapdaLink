import React, { useState, useEffect } from 'react';
import API from '../services/api';
import MapViewComponent from '../components/MapViewComponent';
import { Layers, MapPin, Building2, AlertTriangle, RefreshCw } from 'lucide-react';

const MapPage = () => {
  const [requests, setRequests] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reqRes, shelterRes] = await Promise.all([
        API.get('/requests'),
        API.get('/shelters')
      ]);
      setRequests(reqRes.data);
      setShelters(shelterRes.data);
    } catch (err) {
      console.error('Error loading map data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Live Geospatial Monitoring</span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Disaster Incident & Relief Shelter Map</h1>
          <p className="text-xs text-slate-500">
            Real-time Leaflet & OpenStreetMap visualization of civilian SOS requests, responder deployment, and active capacity.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 text-xs font-bold">
            <span className="flex items-center space-x-1.5 text-red-600">
              <span className="w-3 h-3 rounded-full bg-red-600"></span>
              <span>Distress Calls ({requests.length})</span>
            </span>
            <span className="flex items-center space-x-1.5 text-blue-600">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              <span>Shelters ({shelters.length})</span>
            </span>
          </div>
          <button
            onClick={fetchData}
            className="p-2 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="h-[650px] w-full">
        <MapViewComponent requests={requests} shelters={shelters} />
      </div>
    </div>
  );
};

export default MapPage;
