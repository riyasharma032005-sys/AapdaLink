import React, { useState, useEffect } from "react";
import API from "../services/api";
import DashboardCard from "../components/DashboardCard";
import StatusBadge from "../components/StatusBadge";

import {
  Users,
  AlertTriangle,
  Building2,
  Package,
  XCircle,
  ShieldCheck,
  Trash2,
  RefreshCw,
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);

  // Load dashboard data
  const fetchData = async () => {
    try {
      setLoading(true);

      const [statsRes, usersRes, reqRes] = await Promise.all([
        API.get("/admin/stats"),
        API.get("/admin/users"),
        API.get("/requests"),
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setRequests(reqRes.data);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Verify or unverify a user
  const handleToggleVerify = async (userId, currentStatus) => {
    try {
      await API.put(`/admin/users/${userId}`, {
        isVerified: !currentStatus,
      });

      await fetchData();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to update user"
      );
    }
  };

  // Delete a user
  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this user from the system?"
    );

    if (!confirmed) return;

    try {
      await API.delete(`/admin/users/${userId}`);
      await fetchData();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

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

        {/* ADMIN HEADER */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
              Central Emergency Command
            </span>

            <h1 className="text-2xl font-black text-slate-900 mt-1">
              System Administration
            </h1>

            <p className="text-xs text-slate-600 mt-2">
              Monitor all platform metrics, verify volunteer
              & NGO responders, and oversee life-saving requests.
            </p>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm hover:bg-slate-800 disabled:opacity-60"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                loading ? "animate-spin" : ""
              }`}
            />
            <span>Refresh Live Stats</span>
          </button>
        </div>

        {/* STATISTICS CARDS */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <DashboardCard
              title="Total Users"
              value={stats.users.total}
              icon={Users}
              color="blue"
              subtitle={`${stats.users.volunteers} Volunteers, ${stats.users.ngos} NGOs`}
            />

            <DashboardCard
              title="Total SOS Calls"
              value={stats.requests.total}
              icon={AlertTriangle}
              color="red"
              subtitle={`${stats.requests.pending} Pending, ${stats.requests.inProgress} In Action`}
            />

            <DashboardCard
              title="Relief Shelters"
              value={stats.shelters.total}
              icon={Building2}
              color="purple"
              subtitle={`${stats.shelters.occupancy} / ${stats.shelters.capacity} Beds Occupied`}
            />

            <DashboardCard
              title="Warehouse Items"
              value={stats.resources.total}
              icon={Package}
              color="emerald"
              subtitle="Registered supply stocks"
            />

          </div>
        )}

        {/* TAB CONTROLS */}
        <div className="bg-white/90 backdrop-blur-md rounded-xl px-5 pt-4 shadow-md border border-slate-200">
          <div className="flex flex-wrap border-b border-slate-200 gap-6">

            <button
              onClick={() => setActiveTab("users")}
              className={`pb-3 text-xs font-bold transition border-b-2 ${
                activeTab === "users"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              User Management ({users.length})
            </button>

            <button
              onClick={() => setActiveTab("requests")}
              className={`pb-3 text-xs font-bold transition border-b-2 ${
                activeTab === "requests"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              All Emergency Requests ({requests.length})
            </button>

          </div>
        </div>

        {/* USER MANAGEMENT */}
        {activeTab === "users" && (
          <div className="bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 overflow-hidden shadow-lg">

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">

                <thead className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3.5">Name / Email</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Phone / Org</th>
                    <th className="p-3.5">Verification</th>
                    <th className="p-3.5">Joined Date</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                  {users.map((u) => (
                    <tr
                      key={u._id}
                      className="hover:bg-slate-50 transition"
                    >

                      {/* NAME AND EMAIL */}
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">
                          {u.name}
                        </div>

                        <div className="text-[10px] text-slate-400">
                          {u.email}
                        </div>
                      </td>

                      {/* USER ROLE */}
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                            u.role === "admin"
                              ? "bg-red-100 text-red-700"
                              : u.role === "volunteer"
                              ? "bg-amber-100 text-amber-700"
                              : u.role === "ngo"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      {/* PHONE AND ORGANIZATION */}
                      <td className="p-3.5">
                        <div className="text-slate-700">
                          {u.phone}
                        </div>

                        {u.organizationName && (
                          <div className="text-[10px] text-slate-400">
                            {u.organizationName}
                          </div>
                        )}
                      </td>

                      {/* VERIFY USER */}
                      <td className="p-3.5">
                        <button
                          onClick={() =>
                            handleToggleVerify(
                              u._id,
                              u.isVerified
                            )
                          }
                          className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.isVerified
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                          }`}
                        >
                          {u.isVerified ? (
                            <ShieldCheck className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}

                          <span>
                            {u.isVerified
                              ? "Verified"
                              : "Pending Verification"}
                          </span>
                        </button>
                      </td>

                      {/* JOINED DATE */}
                      <td className="p-3.5 text-slate-400">
                        {u.createdAt
                          ? new Date(
                              u.createdAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </td>

                      {/* DELETE USER */}
                      <td className="p-3.5 text-right">
                        {u.role !== "admin" && (
                          <button
                            onClick={() =>
                              handleDeleteUser(u._id)
                            }
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Remove User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>

                    </tr>
                  ))}

                  {users.length === 0 && !loading && (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-8 text-center text-slate-500"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}

                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ALL EMERGENCY REQUESTS */}
        {activeTab === "requests" && (
          <div className="bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 overflow-hidden shadow-lg">

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">

                <thead className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3.5">Emergency Title</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Priority</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Reported By</th>
                    <th className="p-3.5">Assigned Responder</th>
                    <th className="p-3.5">Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                  {requests.map((req) => (
                    <tr
                      key={req._id}
                      className="hover:bg-slate-50 transition"
                    >

                      {/* EMERGENCY TITLE */}
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">
                          {req.title}
                        </div>

                        <div className="text-[10px] text-slate-400 truncate max-w-xs">
                          {req.address}
                        </div>
                      </td>

                      {/* EMERGENCY TYPE */}
                      <td className="p-3.5 font-bold text-slate-700">
                        {req.emergencyType}
                      </td>

                      {/* PRIORITY */}
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            req.priority === "Critical"
                              ? "bg-red-600 text-white"
                              : req.priority === "High"
                              ? "bg-orange-500 text-white"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {req.priority}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="p-3.5">
                        <StatusBadge status={req.status} />
                      </td>

                      {/* CITIZEN DETAILS */}
                      <td className="p-3.5 text-slate-700">
                        <div>
                          {req.citizen?.name || "Citizen"}
                        </div>

                        <div className="text-[10px] text-slate-400">
                          {req.contactPhone}
                        </div>
                      </td>

                      {/* ASSIGNED RESPONDER */}
                      <td className="p-3.5 text-slate-700">
                        {req.assignedTo ? (
                          <div className="font-semibold text-emerald-700">
                            {req.assignedTo.name} (
                            {req.assignedTo.role})
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* REQUEST DATE */}
                      <td className="p-3.5 text-slate-400">
                        {req.createdAt
                          ? new Date(
                              req.createdAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </td>

                    </tr>
                  ))}

                  {requests.length === 0 && !loading && (
                    <tr>
                      <td
                        colSpan={7}
                        className="p-8 text-center text-slate-500"
                      >
                        No emergency requests found.
                      </td>
                    </tr>
                  )}

                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;