import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import {
  ShieldAlert,
  LifeBuoy,
  Users,
  Home,
  ArrowRight,
  PhoneCall,
  HeartHandshake,
  MapPin,
} from "lucide-react";
import RequestCard from "../components/RequestCard";

const HomePage = () => {
  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const { data } = await API.get("/requests");

        if (Array.isArray(data)) {
          setRecentRequests(data.slice(0, 3));
        } else if (Array.isArray(data?.requests)) {
          setRecentRequests(data.requests.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load recent requests:", err);
      }
    };

    fetchPublicData();
  }, []);

  return (
    <div
      className="min-h-screen space-y-16 pb-16 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.55)), url('/images/images.jpg.jpeg')",
        backgroundAttachment: "fixed",
      }}
    >
      {/* HERO SECTION */}
      <section className="relative overflow-hidden text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-cyan-100 border border-cyan-300/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>
              Real-time Community Disaster Response Network
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight text-white drop-shadow-lg">
            Rapid Help When
            <br className="hidden sm:block" />
            <span className="text-cyan-200">
              {" "}Every Second Counts.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-200 max-w-3xl mx-auto font-normal leading-relaxed">
            AapdaLink bridges citizens in crisis with local rescue
            volunteers, verified NGOs, and relief shelters.
            Request food, medical aid, or rescue with immediate
            live coordination.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-red-600 font-extrabold rounded-xl shadow-lg hover:bg-slate-100 transition flex items-center justify-center space-x-2 text-base"
            >
              <LifeBuoy className="w-5 h-5 text-red-600" />
              <span>Request Emergency Help</span>
            </Link>

            <Link
              to="/map"
              className="w-full sm:w-auto px-8 py-3.5 bg-red-700/80 hover:bg-red-700 text-white font-bold rounded-xl border border-red-500/50 transition flex items-center justify-center space-x-2 text-base"
            >
              <MapPin className="w-5 h-5" />
              <span>Explore Live Disaster Map</span>
            </Link>
          </div>
        </div>
      </section>

      {/* EMERGENCY STATISTICS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100 text-center">
            <div className="w-10 h-10 mx-auto rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-slate-900">
              24/7
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Live Coordination
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100 text-center">
            <div className="w-10 h-10 mx-auto rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-slate-900">
              100+
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Active Volunteers
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100 text-center">
            <div className="w-10 h-10 mx-auto rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Home className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-slate-900">
              50+
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Relief Shelters
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100 text-center">
            <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-slate-900">
              98%
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Dispatched Aid
            </p>
          </div>

        </div>
      </section>

      {/* HOW AAPDALINK WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-lg">
            How AapdaLink Operates
          </h2>
          <p className="text-slate-100 text-sm">
            Designed for high-stress disaster conditions
            with a streamlined, dependable 4-step workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-black flex items-center justify-center">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Citizen Reports SOS
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Affected persons report emergency needs
              (Food, Medical, Rescue) with GPS coordinates
              and optional photos.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-black flex items-center justify-center">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Instant Broadcast
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              WebSockets notify nearby responders,
              volunteers, and disaster relief NGOs
              on interactive live maps.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Volunteer / NGO Accepts
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Volunteers accept the mission,
              update status to "In Progress",
              and mobilize supplies and rescue boats.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Help Provided
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Assistance is safely delivered,
              citizens are evacuated or sheltered,
              and the request is closed as Completed.
            </p>
          </div>

        </div>
      </section>

     

      {/* URGENT EMERGENCY HELPLINES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/95 rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-bold">
              In Urgent Life Threatening Danger?
            </h3>
            <p className="text-xs text-slate-400">
              Direct state emergency responders are
              available around the clock.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">

            <a
              href="tel:112"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>National Helpline: 112</span>
            </a>

            <a
              href="tel:1078"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition border border-slate-700 flex items-center space-x-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Disaster Helpline: 1078</span>
            </a>

          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;