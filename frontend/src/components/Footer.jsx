import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Heart, Phone, Mail, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">AapdaLink</span>
            </div>
            <p className="text-slate-400 max-w-sm text-xs leading-relaxed">
              A community disaster response and humanitarian coordination platform designed to bridge citizens in distress with on-ground volunteers, registered NGOs, and emergency relief shelters in real time.
            </p>
            <div className="flex items-center space-x-2 text-xs text-red-400 font-semibold pt-2">
              <Phone className="w-4 h-4" />
              <span>National Disaster Helpline: 1078 / 112</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase">Quick Portals</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/map" className="hover:text-white transition">Live Incident Map</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Citizen SOS Portal</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Volunteer Responders</Link></li>
              <li><Link to="/login" className="hover:text-white transition">NGO Aid Logistics</Link></li>
              <li><Link to="/about" className="hover:text-white transition">Helplines & Advisory</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase">Project Info</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Built as a robust Full-Stack Capstone Project using React, Express, MongoDB, Leaflet, and WebSockets.
            </p>
            <div className="text-xs text-slate-500">
              © {new Date().getFullYear()} AapdaLink. Open Community Relief.
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
