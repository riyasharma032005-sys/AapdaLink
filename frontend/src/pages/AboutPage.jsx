import React from 'react';
import { PhoneCall, ShieldAlert, Heart, Info, Globe, LifeBuoy } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Intro */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 bg-red-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-md shadow-red-200">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-black text-slate-900">About AapdaLink</h1>
        <p className="text-slate-600 text-sm max-w-2xl mx-auto">
          AapdaLink (आपदा लिंक) is an open-source, community-driven disaster resource and emergency response coordination platform designed to empower citizens, volunteers, and NGOs in the event of natural disasters such as floods, earthquakes, and cyclones.
        </p>
      </div>

      {/* Emergency Helplines Directory */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center space-x-2 text-red-600 border-b border-slate-100 pb-3">
          <PhoneCall className="w-5 h-5" />
          <h2 className="text-lg font-bold text-slate-900">Critical Emergency Helplines (India)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-1">
            <span className="font-bold text-red-700 text-sm">112</span>
            <div className="font-semibold text-slate-800">National Emergency Number</div>
            <p className="text-slate-500 text-[11px]">All-in-one Police, Fire, Ambulance</p>
          </div>

          <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-1">
            <span className="font-bold text-red-700 text-sm">1078</span>
            <div className="font-semibold text-slate-800">Disaster Management (NDMA)</div>
            <p className="text-slate-500 text-[11px]">National Disaster Management Control Room</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 text-sm">1070</span>
            <div className="font-semibold text-slate-800">State Relief Helpline</div>
            <p className="text-slate-500 text-[11px]">State Emergency Operations Center</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 text-sm">102 / 108</span>
            <div className="font-semibold text-slate-800">Ambulance Services</div>
            <p className="text-slate-500 text-[11px]">Emergency Medical Response</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 text-sm">101</span>
            <div className="font-semibold text-slate-800">Fire & Rescue Services</div>
            <p className="text-slate-500 text-[11px]">Fire Control & Water Rescue Units</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 text-sm">1091 / 181</span>
            <div className="font-semibold text-slate-800">Women Helpline</div>
            <p className="text-slate-500 text-[11px]">Women in distress rescue and support</p>
          </div>
        </div>
      </div>

      {/* Disaster Preparedness Checklist */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <LifeBuoy className="w-5 h-5 text-red-600" />
          <span>Disaster Survival Kit Checklist</span>
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span>At least 3-day supply of drinking water (3 litres/person/day)</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span>Non-perishable ready-to-eat dry rations & energy bars</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span>Waterproof pouch for government IDs, deeds, and passports</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span>Fully charged power bank and emergency flashlight</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span>Basic first aid kit with prescribed medications</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span>Whistle for signaling location to search & rescue teams</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AboutPage;
