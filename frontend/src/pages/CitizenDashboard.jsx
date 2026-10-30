import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import DashboardCard from "../components/DashboardCard";
import RequestCard from "../components/RequestCard";
import CreateRequestModal from "../components/CreateRequestModal";

import {
  AlertTriangle,
  Clock,
  CheckCircle,
  RefreshCw,
} from "lucide-react";

const CitizenDashboard = () => {
  const { user } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch citizen emergency requests
  const fetchMyRequests = async () => {
    try {
      setLoading(true);

      const { data } = await API.get(
        "/requests/my-requests"
      );

      setRequests(data);
    } catch (err) {
      console.error(
        "Error fetching requests:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  // Update emergency request status
  const handleStatusUpdate = async (
    id,
    newStatus
  ) => {
    try {
      await API.put(
        `/requests/${id}/status`,
        {
          status: newStatus,
        }
      );

      fetchMyRequests();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to update request"
      );
    }
  };

  // Calculate dashboard statistics
  const pendingCount = requests.filter(
    (r) => r.status === "Pending"
  ).length;

  const inProgressCount = requests.filter(
    (r) => r.status === "In Progress"
  ).length;

  const completedCount = requests.filter(
    (r) => r.status === "Completed"
  ).length;

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(rgba(79, 129, 162, 0.82), rgba(240, 249, 255, 0.90)), url('/images/disaster.images.jpg')",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* CITIZEN DASHBOARD HEADER */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
              Citizen Crisis Portal
            </span>

            <h1 className="text-2xl font-black text-slate-900 mt-1">
              Welcome back, {user?.name}
            </h1>

            <p className="text-xs text-slate-600 mt-2">
              Need emergency assistance? Broadcast an immediate
              SOS to verified volunteers and relief camps.
            </p>
          </div>

          {/* REPORT EMERGENCY BUTTON */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-lg shadow-red-200 transition flex items-center justify-center space-x-2 text-sm"
          >
            <AlertTriangle className="w-5 h-5 text-white" />
            <span>Report Emergency Need</span>
          </button>

        </div>

        {/* CITIZEN STATISTICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <DashboardCard
            title="Awaiting Response"
            value={pendingCount}
            icon={Clock}
            color="amber"
            subtitle="Pending assignment to responders"
          />

          <DashboardCard
            title="Aid En Route"
            value={inProgressCount}
            icon={AlertTriangle}
            color="purple"
            subtitle="Volunteer or NGO currently assisting"
          />

          <DashboardCard
            title="Completed / Safe"
            value={completedCount}
            icon={CheckCircle}
            color="emerald"
            subtitle="Resolved emergency situations"
          />

        </div>

        {/* MY EMERGENCY REQUESTS SECTION */}
        <div className="space-y-4">

          {/* REQUESTS HEADER */}
          <div className="bg-white/90 backdrop-blur-md rounded-xl p-5 border border-slate-200 shadow-md flex flex-wrap items-center justify-between gap-4">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                My Emergency Requests ({requests.length})
              </h2>

              <p className="text-xs text-slate-600 mt-1">
                Track real-time status of your calls for help
              </p>
            </div>

            {/* REFRESH BUTTON */}
            <button
              onClick={fetchMyRequests}
              disabled={loading}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center space-x-1 font-semibold p-2 border border-slate-200 rounded-lg bg-white disabled:opacity-60"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  loading ? "animate-spin" : ""
                }`}
              />
              <span>Refresh</span>
            </button>

          </div>

          {/* REQUESTS CONTENT */}
          {loading ? (

            <div className="bg-white/90 backdrop-blur-md rounded-2xl text-center py-12 text-slate-600 text-sm font-semibold shadow-md">
              Loading your requests...
            </div>

          ) : requests.length === 0 ? (

            <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3 shadow-lg">

              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>

              <h3 className="font-bold text-slate-800 text-base">
                No Active Distress Calls
              </h3>

              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                You haven't reported any emergency requests yet.
                If you or someone nearby is in danger,
                press the button below.
              </p>

              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition"
              >
                Report Emergency Now
              </button>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {requests.map((req) => (
                <RequestCard
                  key={req._id}
                  request={req}
                  currentUserRole="citizen"
                  onStatusUpdate={handleStatusUpdate}
                />
              ))}

            </div>

          )}

        </div>

        {/* EMERGENCY HELPLINE SECTION */}
        <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl p-6 border border-slate-700 shadow-lg">

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold text-white">
                Need Immediate Emergency Assistance?
              </h3>

              <p className="text-xs text-slate-300 mt-1">
                Contact emergency services directly
                for life-threatening situations.
              </p>
            </div>

            <a
              href="tel:112"
              className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition"
            >
              Call Emergency: 112
            </a>

          </div>

        </div>

      </div>

      {/* CREATE EMERGENCY REQUEST MODAL */}
      <CreateRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRequestCreated={() => fetchMyRequests()}
      />

    </div>
  );
};

export default CitizenDashboard;