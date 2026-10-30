import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import DashboardCard from "../components/DashboardCard";
import RequestCard from "../components/RequestCard";
import MapViewComponent from "../components/MapViewComponent";

import {
  AlertTriangle,
  CheckCircle,
  ListFilter,
  RefreshCw,
  Navigation,
} from "lucide-react";

const VolunteerDashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("feed");
  const [allRequests, setAllRequests] = useState([]);
  const [assignedRequests, setAssignedRequests] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("Pending");
  const [loading, setLoading] = useState(true);

  // Fetch volunteer dashboard data
  const fetchData = async () => {
    try {
      setLoading(true);

      const [reqRes, assignedRes, sheltersRes] =
        await Promise.all([
          API.get("/requests"),
          API.get("/requests/assigned"),
          API.get("/shelters"),
        ]);

      setAllRequests(reqRes.data);
      setAssignedRequests(assignedRes.data);
      setShelters(sheltersRes.data);
    } catch (err) {
      console.error("Error fetching volunteer data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Accept emergency mission
  const handleAccept = async (id) => {
    try {
      await API.put(`/requests/${id}/accept`);

      alert(
        "You have accepted this emergency mission. Proceed with caution!"
      );

      fetchData();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to accept request"
      );
    }
  };

  // Update emergency mission status
  const handleStatusUpdate = async (id, status) => {
    try {
      await API.put(`/requests/${id}/status`, {
        status,
      });

      fetchData();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to update status"
      );
    }
  };

  // Filter emergency requests
  const filteredFeed = allRequests.filter((r) => {
    const matchType =
      filterType === "all" ||
      r.emergencyType === filterType;

    const matchStatus =
      filterStatus === "all" ||
      r.status === filterStatus;

    return matchType && matchStatus;
  });

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(rgba(79, 129, 162, 0.82), rgba(240, 249, 255, 0.90)), url('/images/disaster.image.jpg')",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* VOLUNTEER DASHBOARD HEADER */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Volunteer Responder Center
            </span>

            <h1 className="text-2xl font-black text-slate-900 mt-1">
              Hello, {user?.name}
            </h1>

            <p className="text-xs text-slate-600 mt-2">
              View urgent distress calls nearby, claim missions,
              and navigate to ground coordinates.
            </p>
          </div>

          {/* DASHBOARD NAVIGATION */}
          <div className="flex flex-wrap items-center gap-2">

            <button
              onClick={() => setActiveTab("feed")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "feed"
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              SOS Feed
            </button>

            <button
              onClick={() => setActiveTab("assigned")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "assigned"
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              My Active Missions (
              {
                assignedRequests.filter(
                  (r) => r.status === "In Progress"
                ).length
              }
              )
            </button>

            <button
              onClick={() => setActiveTab("map")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "map"
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Live Map
            </button>

          </div>
        </div>

        {/* VOLUNTEER STATISTICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <DashboardCard
            title="Open Urgent Requests"
            value={
              allRequests.filter(
                (r) => r.status === "Pending"
              ).length
            }
            icon={AlertTriangle}
            color="red"
            subtitle="Waiting for response on ground"
          />

          <DashboardCard
            title="My In-Progress Missions"
            value={
              assignedRequests.filter(
                (r) => r.status === "In Progress"
              ).length
            }
            icon={Navigation}
            color="purple"
            subtitle="Accepted tasks currently being handled"
          />

          <DashboardCard
            title="Missions Completed"
            value={
              assignedRequests.filter(
                (r) => r.status === "Completed"
              ).length
            }
            icon={CheckCircle}
            color="emerald"
            subtitle="Total relief delivered by you"
          />

        </div>

        {/* SOS FEED TAB */}
        {activeTab === "feed" && (
          <div className="space-y-6">

            {/* FILTER BAR */}
            <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-md flex flex-wrap items-center justify-between gap-3 text-xs">

              <div className="flex flex-wrap items-center gap-3">

                <span className="font-bold text-slate-700 flex items-center space-x-1">
                  <ListFilter className="w-3.5 h-3.5" />
                  <span>Filter Requests:</span>
                </span>

                {/* EMERGENCY TYPE FILTER */}
                <select
                  value={filterType}
                  onChange={(e) =>
                    setFilterType(e.target.value)
                  }
                  className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-medium text-slate-700"
                >
                  <option value="all">All Needs</option>
                  <option value="Rescue">Rescue</option>
                  <option value="Food">Food</option>
                  <option value="Water">Water</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Shelter">Shelter</option>
                  <option value="Other">Other</option>
                </select>

                {/* STATUS FILTER */}
                <select
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(e.target.value)
                  }
                  className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-medium text-slate-700"
                >
                  <option value="Pending">
                    Pending Only
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="all">
                    All Statuses
                  </option>
                </select>

              </div>

              {/* REFRESH BUTTON */}
              <button
                onClick={fetchData}
                className="text-slate-600 hover:text-slate-900 flex items-center space-x-1 font-semibold"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
                <span>Refresh Feed</span>
              </button>

            </div>

            {/* EMERGENCY REQUEST CARDS */}
            {loading ? (
              <div className="bg-white/90 rounded-2xl text-center py-12 text-slate-600 text-sm">
                Loading incident feed...
              </div>
            ) : filteredFeed.length === 0 ? (
              <div className="bg-white/95 rounded-2xl border border-dashed border-slate-300 p-12 text-center text-sm text-slate-600 shadow-md">
                No emergency requests match your current filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {filteredFeed.map((req) => (
                  <RequestCard
                    key={req._id}
                    request={req}
                    currentUserRole="volunteer"
                    currentUserId={user?._id}
                    onAccept={handleAccept}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))}

              </div>
            )}

          </div>
        )}

        {/* MY ASSIGNED MISSIONS TAB */}
        {activeTab === "assigned" && (
          <div className="space-y-6">

            <h2 className="text-xl font-bold text-slate-900">
              My Accepted Missions (
              {assignedRequests.length})
            </h2>

            {assignedRequests.length === 0 ? (
              <div className="bg-white/95 rounded-2xl border border-dashed border-slate-300 p-12 text-center text-sm text-slate-600 shadow-md">
                You haven't accepted any distress missions yet.
                Check the SOS Feed to accept nearby tasks.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {assignedRequests.map((req) => (
                  <RequestCard
                    key={req._id}
                    request={req}
                    currentUserRole="volunteer"
                    currentUserId={user?._id}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))}

              </div>
            )}

          </div>
        )}

        {/* LIVE DISASTER MAP TAB */}
        {activeTab === "map" && (
          <div className="space-y-4">

            <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-md">

              <h2 className="text-base font-bold text-slate-900 mb-1">
                Live Geospatial Incident & Relief Map
              </h2>

              <p className="text-xs text-slate-600">
                Red markers represent emergency distress incidents.
                Blue markers denote verified relief shelters.
              </p>

            </div>

            <div className="h-[550px] rounded-2xl overflow-hidden shadow-lg border border-white/40">
              <MapViewComponent
                requests={allRequests}
                shelters={shelters}
              />
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default VolunteerDashboard;