import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import DashboardCard from "../components/DashboardCard";
import RequestCard from "../components/RequestCard";

import {
  Package,
  Home,
  AlertTriangle,
  Plus,
  Trash2,
} from "lucide-react";

const NgoDashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("resources");
  const [resources, setResources] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Resource modal
  const [showResourceModal, setShowResourceModal] = useState(false);

  const [resourceForm, setResourceForm] = useState({
    category: "Food",
    itemName: "",
    quantity: 100,
    unit: "packets",
    warehouseLocation: "",
    notes: "",
    status: "Available",
  });

  // Shelter modal
  const [showShelterModal, setShowShelterModal] = useState(false);

  const [shelterForm, setShelterForm] = useState({
    name: "",
    address: "",
    capacity: 100,
    currentOccupancy: 0,
    contactPerson: user?.name || "",
    contactPhone: user?.phone || "",
    amenities: "Drinking Water, First Aid, Food",
    latitude: 19.076,
    longitude: 72.8777,
  });

  // Fetch dashboard data
  const fetchData = async () => {
    try {
      setLoading(true);

      const [resData, shelterData, reqData] = await Promise.all([
        API.get("/resources"),
        API.get("/shelters"),
        API.get("/requests"),
      ]);

      setResources(resData.data);
      setShelters(shelterData.data);
      setRequests(reqData.data);
    } catch (err) {
      console.error("Failed to load NGO dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Create inventory resource
  const handleCreateResource = async (e) => {
    e.preventDefault();

    try {
      await API.post("/resources", resourceForm);

      setShowResourceModal(false);

      setResourceForm({
        category: "Food",
        itemName: "",
        quantity: 100,
        unit: "packets",
        warehouseLocation: "",
        notes: "",
        status: "Available",
      });

      fetchData();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Error creating resource"
      );
    }
  };

  // Delete inventory resource
  const handleDeleteResource = async (id) => {
    if (!window.confirm("Delete this resource item from inventory?")) {
      return;
    }

    try {
      await API.delete(`/resources/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  // Register shelter
  const handleCreateShelter = async (e) => {
    e.preventDefault();

    try {
      await API.post("/shelters", shelterForm);
      setShowShelterModal(false);
      fetchData();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Error creating shelter"
      );
    }
  };

  // Delete shelter
  const handleDeleteShelter = async (id) => {
    if (!window.confirm("Remove this shelter from network?")) {
      return;
    }

    try {
      await API.delete(`/shelters/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  // Accept emergency request
  const handleAcceptRequest = async (id) => {
    try {
      await API.put(`/requests/${id}/accept`);

      alert(
        "Your NGO has taken charge of this emergency request."
      );

      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept");
    }
  };

  // Update request status
  const handleStatusUpdate = async (id, status) => {
    try {
      await API.put(`/requests/${id}/status`, {
        status,
      });

      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update");
    }
  };

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

        {/* NGO DASHBOARD HEADER */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              NGO Relief Coordination
            </span>

            <h1 className="text-2xl font-black text-slate-900 mt-1">
              {user?.organizationName || user?.name}
            </h1>

            <p className="text-xs text-slate-600 mt-2">
              Manage warehouse relief inventory, emergency
              shelters, and allocate resources to distress calls.
            </p>
          </div>

          {/* NAVIGATION TABS */}
          <div className="flex flex-wrap items-center gap-2">

            <button
              onClick={() => setActiveTab("resources")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "resources"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Resources ({resources.length})
            </button>

            <button
              onClick={() => setActiveTab("shelters")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "shelters"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Shelters ({shelters.length})
            </button>

            <button
              onClick={() => setActiveTab("requests")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "requests"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Distress SOS (
              {requests.filter((r) => r.status === "Pending").length})
            </button>

          </div>
        </div>

        {/* NGO STATISTICS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <DashboardCard
            title="Stocked Inventory"
            value={resources.length}
            icon={Package}
            color="blue"
            subtitle="Tracked emergency relief items"
          />

          <DashboardCard
            title="Shelter Capacity"
            value={`${shelters.reduce(
              (acc, s) => acc + (Number(s.currentOccupancy) || 0),
              0
            )} / ${shelters.reduce(
              (acc, s) => acc + (Number(s.capacity) || 0),
              0
            )}`}
            icon={Home}
            color="purple"
            subtitle="Current occupants vs total beds"
          />

          <DashboardCard
            title="Open Community Calls"
            value={
              requests.filter((r) => r.status === "Pending").length
            }
            icon={AlertTriangle}
            color="red"
            subtitle="Civilians awaiting aid or supplies"
          />

        </div>

        {/* RESOURCE MANAGEMENT TAB */}
        {activeTab === "resources" && (
          <div className="space-y-4">

            <div className="bg-white/90 backdrop-blur-md rounded-xl p-5 border border-slate-200 shadow-md flex flex-wrap items-center justify-between gap-3">

              <h2 className="text-lg font-bold text-slate-900">
                Relief Inventory Management
              </h2>

              <button
                onClick={() => setShowResourceModal(true)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Resource Item</span>
              </button>

            </div>

            <div className="bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 overflow-hidden shadow-lg">

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">

                  <thead className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3.5">Item Name</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Stock Quantity</th>
                      <th className="p-3.5">Warehouse Location</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {resources.map((res) => (
                      <tr
                        key={res._id}
                        className="hover:bg-slate-50 transition"
                      >

                        <td className="p-3.5 font-bold text-slate-900">
                          {res.itemName}
                        </td>

                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                            {res.category}
                          </span>
                        </td>

                        <td className="p-3.5 font-bold text-slate-800">
                          {res.quantity} {res.unit}
                        </td>

                        <td className="p-3.5 text-slate-500">
                          {res.warehouseLocation}
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              res.status === "Available"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {res.status}
                          </span>
                        </td>

                        <td className="p-3.5 text-right">
                          <button
                            onClick={() =>
                              handleDeleteResource(res._id)
                            }
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Delete Resource"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>

                      </tr>
                    ))}

                    {resources.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-8 text-center text-slate-500"
                        >
                          {loading
                            ? "Loading resources..."
                            : "No resources added yet. Click Add Resource Item to stock inventory."}
                        </td>
                      </tr>
                    )}

                  </tbody>
                </table>
              </div>

            </div>
          </div>
        )}

        {/* SHELTER MANAGEMENT TAB */}
        {activeTab === "shelters" && (
          <div className="space-y-4">

            <div className="bg-white/90 backdrop-blur-md rounded-xl p-5 border border-slate-200 shadow-md flex flex-wrap items-center justify-between gap-3">

              <h2 className="text-lg font-bold text-slate-900">
                Relief Shelters & Camps
              </h2>

              <button
                onClick={() => setShowShelterModal(true)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Register New Shelter</span>
              </button>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {shelters.map((shelter) => (
                <div
                  key={shelter._id}
                  className="bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 p-5 shadow-lg space-y-3"
                >

                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-bold text-slate-900 text-base">
                      {shelter.name}
                    </h3>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        shelter.status === "Open"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {shelter.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    {shelter.address}
                  </p>

                  {/* OCCUPANCY PROGRESS */}
                  <div className="space-y-1">

                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>Occupancy</span>
                      <span>
                        {shelter.currentOccupancy} / {shelter.capacity} Beds
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            ((Number(shelter.currentOccupancy) || 0) /
                              (Number(shelter.capacity) || 1)) *
                              100
                          )}%`,
                        }}
                      />
                    </div>

                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3 text-xs text-slate-500">

                    <span>
                      📞 {shelter.contactPhone} ({shelter.contactPerson})
                    </span>

                    <button
                      onClick={() =>
                        handleDeleteShelter(shelter._id)
                      }
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Delete Shelter"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>

                </div>
              ))}

              {shelters.length === 0 && (
                <div className="md:col-span-2 bg-white/95 backdrop-blur-md rounded-xl border border-dashed border-slate-300 p-12 text-center text-xs text-slate-500 shadow-md">
                  {loading
                    ? "Loading shelters..."
                    : "No shelters active. Register your first emergency relief shelter above."}
                </div>
              )}

            </div>
          </div>
        )}

        {/* COMMUNITY SOS REQUESTS TAB */}
        {activeTab === "requests" && (
          <div className="space-y-6">

            <div className="bg-white/90 backdrop-blur-md rounded-xl p-5 border border-slate-200 shadow-md">
              <h2 className="text-lg font-bold text-slate-900">
                Community Emergency SOS Requests
              </h2>
            </div>

            {loading ? (
              <div className="bg-white/95 rounded-xl p-12 text-center text-slate-600">
                Loading emergency requests...
              </div>
            ) : requests.length === 0 ? (
              <div className="bg-white/95 rounded-xl p-12 text-center text-slate-600">
                No emergency requests available.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {requests.map((req) => (
                  <RequestCard
                    key={req._id}
                    request={req}
                    currentUserRole="ngo"
                    currentUserId={user?._id}
                    onAccept={handleAcceptRequest}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))}

              </div>
            )}

          </div>
        )}

      </div>

      {/* CREATE RESOURCE MODAL */}
      {showResourceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">

            <h3 className="text-base font-bold text-slate-900 mb-4">
              Add Inventory Resource
            </h3>

            <form
              onSubmit={handleCreateResource}
              className="space-y-3 text-xs"
            >

              <div>
                <label className="block font-semibold mb-1">
                  Item Name
                </label>

                <input
                  type="text"
                  required
                  value={resourceForm.itemName}
                  onChange={(e) =>
                    setResourceForm({
                      ...resourceForm,
                      itemName: e.target.value,
                    })
                  }
                  placeholder="e.g. Inflatable Life Jackets"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">

                <div>
                  <label className="block font-semibold mb-1">
                    Category
                  </label>

                  <select
                    value={resourceForm.category}
                    onChange={(e) =>
                      setResourceForm({
                        ...resourceForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    {[
                      "Food",
                      "Water",
                      "Medicine",
                      "First Aid",
                      "Blankets",
                      "Rescue Kit",
                      "Hygiene",
                      "Other",
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">
                    Quantity
                  </label>

                  <input
                    type="number"
                    min="1"
                    required
                    value={resourceForm.quantity}
                    onChange={(e) =>
                      setResourceForm({
                        ...resourceForm,
                        quantity: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

              </div>

              <div>
                <label className="block font-semibold mb-1">
                  Unit of Measure
                </label>

                <input
                  type="text"
                  required
                  value={resourceForm.unit}
                  onChange={(e) =>
                    setResourceForm({
                      ...resourceForm,
                      unit: e.target.value,
                    })
                  }
                  placeholder="e.g. packets, litres, kits, boxes"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  Warehouse / Depot Location
                </label>

                <input
                  type="text"
                  required
                  value={resourceForm.warehouseLocation}
                  onChange={(e) =>
                    setResourceForm({
                      ...resourceForm,
                      warehouseLocation: e.target.value,
                    })
                  }
                  placeholder="e.g. Andheri Central Hub, Bay 3"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">

                <button
                  type="button"
                  onClick={() => setShowResourceModal(false)}
                  className="px-4 py-2 border rounded-lg font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-sm"
                >
                  Save Item
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      {/* CREATE SHELTER MODAL */}
      {showShelterModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">

            <h3 className="text-base font-bold text-slate-900 mb-4">
              Register Relief Shelter
            </h3>

            <form
              onSubmit={handleCreateShelter}
              className="space-y-3 text-xs"
            >

              <div>
                <label className="block font-semibold mb-1">
                  Shelter / Camp Name
                </label>

                <input
                  type="text"
                  required
                  value={shelterForm.name}
                  onChange={(e) =>
                    setShelterForm({
                      ...shelterForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g. St. Xavier Disaster Camp"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  Address / Landmark
                </label>

                <input
                  type="text"
                  required
                  value={shelterForm.address}
                  onChange={(e) =>
                    setShelterForm({
                      ...shelterForm,
                      address: e.target.value,
                    })
                  }
                  placeholder="e.g. Fort Ground, South Mumbai"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">

                <div>
                  <label className="block font-semibold mb-1">
                    Total Capacity
                  </label>

                  <input
                    type="number"
                    min="1"
                    required
                    value={shelterForm.capacity}
                    onChange={(e) =>
                      setShelterForm({
                        ...shelterForm,
                        capacity: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">
                    Current Occupancy
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={shelterForm.currentOccupancy}
                    onChange={(e) =>
                      setShelterForm({
                        ...shelterForm,
                        currentOccupancy: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

              </div>

              <div className="grid grid-cols-2 gap-2">

                <div>
                  <label className="block font-semibold mb-1">
                    Contact Person
                  </label>

                  <input
                    type="text"
                    required
                    value={shelterForm.contactPerson}
                    onChange={(e) =>
                      setShelterForm({
                        ...shelterForm,
                        contactPerson: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">
                    Contact Phone
                  </label>

                  <input
                    type="text"
                    required
                    value={shelterForm.contactPhone}
                    onChange={(e) =>
                      setShelterForm({
                        ...shelterForm,
                        contactPhone: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

              </div>

              <div className="flex justify-end space-x-2 pt-3">

                <button
                  type="button"
                  onClick={() => setShowShelterModal(false)}
                  className="px-4 py-2 border rounded-lg font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-sm"
                >
                  Register Shelter
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default NgoDashboard;