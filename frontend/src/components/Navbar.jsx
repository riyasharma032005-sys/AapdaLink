import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

import {
  Menu,
  X,
  LogOut,
  MapPin,
  ShieldAlert,
  Layers,
  Home,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { liveAlert, clearAlert } = useSocket();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Handle user logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get dashboard path based on role
  const getDashboardPath = () => {
    if (!user) return "/login";

    switch (user.role) {
      case "citizen":
        return "/citizen/dashboard";

      case "volunteer":
        return "/volunteer/dashboard";

      case "ngo":
        return "/ngo/dashboard";

      case "admin":
        return "/admin/dashboard";

      default:
        return "/";
    }
  };

  // Remove emergency emoji from alert message
  const cleanAlertMessage = (message) => {
    if (typeof message !== "string") return "";

    return message
      .replace(/🚨/g, "")
      .trim();
  };

  return (
    <>
      {/* LIVE SOS NOTIFICATION - BLUE THEME */}
      {liveAlert && (
        <div
          className="
            w-full
            bg-gradient-to-r
            from-blue-800
            via-blue-600
            to-cyan-600
            text-white
            px-4 sm:px-6
            py-3
            flex
            items-center
            justify-between
            gap-4
            shadow-md
            border-b
            border-blue-400
          "
        >
          {/* Notification text without warning icon */}
          <div className="flex items-center min-w-0">
            <span className="text-sm font-semibold break-words">
              {cleanAlertMessage(liveAlert.message)}
            </span>
          </div>

          {/* Dismiss notification */}
          <button
            onClick={clearAlert}
            className="
              bg-blue-900/60
              hover:bg-blue-900
              text-white
              px-4
              py-2
              rounded-lg
              text-xs
              font-bold
              transition
              duration-200
              flex-shrink-0
            "
          >
            Dismiss
          </button>
        </div>
      )}

      {/* MAIN NAVBAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* LOGO */}
            <div className="flex items-center space-x-3">
              <Link
                to="/"
                className="flex items-center space-x-2"
              >
                <div
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-red-600
                    flex
                    items-center
                    justify-center
                    text-white
                    shadow-md
                    shadow-red-200
                  "
                >
                  <ShieldAlert className="w-6 h-6" />
                </div>

                <div>
                  <span className="text-xl font-black tracking-tight text-slate-900">
                    Aapda
                    <span className="text-red-600">
                      Link
                    </span>
                  </span>

                  <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                    Disaster Coordination
                  </p>
                </div>
              </Link>
            </div>

            {/* DESKTOP NAVIGATION */}
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">

              <Link
                to="/"
                className="hover:text-blue-600 flex items-center space-x-1.5 transition"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>

              <Link
                to="/map"
                className="hover:text-blue-600 flex items-center space-x-1.5 transition"
              >
                <MapPin className="w-4 h-4" />
                <span>Live Map</span>
              </Link>

              <Link
                to="/about"
                className="hover:text-blue-600 transition"
              >
                About & Helplines
              </Link>

              {/* LOGGED IN USER */}
              {user ? (
                <div className="flex items-center space-x-4 pl-4 border-l border-slate-200">

                  {/* Dashboard button */}
                  <Link
                    to={getDashboardPath()}
                    className="
                      bg-blue-50
                      text-blue-700
                      hover:bg-blue-100
                      px-3.5
                      py-1.5
                      rounded-lg
                      text-sm
                      font-semibold
                      transition
                      flex
                      items-center
                      space-x-1.5
                      border
                      border-blue-200
                    "
                  >
                    <Layers className="w-4 h-4" />

                    <span>
                      Dashboard ({user.role.toUpperCase()})
                    </span>
                  </Link>

                  {/* USER PROFILE */}
                  <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                    <span
                      className="
                        w-8
                        h-8
                        rounded-full
                        bg-blue-100
                        flex
                        items-center
                        justify-center
                        text-blue-700
                        font-bold
                      "
                    >
                      {user.name?.charAt(0)}
                    </span>

                    <span className="hidden lg:inline">
                      {user.name}
                    </span>
                  </div>

                  {/* LOGOUT BUTTON */}
                  <button
                    onClick={handleLogout}
                    className="text-slate-400 hover:text-blue-600 transition p-1"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                /* GUEST NAVIGATION */
                <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">

                  <Link
                    to="/login"
                    className="text-slate-700 hover:text-blue-600 font-semibold transition"
                  >
                    Log in
                  </Link>

                  <Link
                    to="/register"
                    className="
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                      px-4
                      py-2
                      rounded-lg
                      font-semibold
                      shadow-sm
                      shadow-blue-200
                      transition
                    "
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>

            {/* MOBILE MENU BUTTON */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() =>
                  setMobileMenuOpen(!mobileMenuOpen)
                }
                className="text-slate-600 p-2 focus:outline-none"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>

          </div>
        </div>

        {/* MOBILE NAVIGATION */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">

            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 font-medium"
            >
              Home
            </Link>

            <Link
              to="/map"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 font-medium"
            >
              Live Disaster Map
            </Link>

            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 font-medium"
            >
              About & Helplines
            </Link>

            {user ? (
              <div className="pt-3 border-t border-slate-200 space-y-3">

                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-3 bg-blue-50 text-blue-700 rounded-lg font-semibold"
                >
                  My Dashboard ({user.role.toUpperCase()})
                </Link>

                <div className="flex items-center justify-between py-2 text-sm text-slate-600">
                  <span>
                    Logged in as:{" "}
                    <strong>{user.name}</strong>
                  </span>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="text-blue-600 font-semibold"
                  >
                    Log out
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-200 space-y-2">

                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2 border border-slate-300 rounded-lg font-semibold text-slate-700"
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2 bg-blue-600 text-white rounded-lg font-semibold shadow"
                >
                  Register
                </Link>

              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;