import React from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaBed,
  FaClipboardList,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const linkClass = (path) =>
    `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
      currentPath === path
        ? "bg-blue-100 text-blue-600 font-semibold"
        : "text-gray-700 hover:text-blue-600"
    }`;
  const handleLogout = () => {
    // Hapus token dari localStorage/session
    localStorage.removeItem("token");

    // Redirect ke halaman login
    window.location.href = "/login";
  };

  return (
    <div className="w-64 bg-white shadow h-screen p-6">
      <div className="mb-6">
        <img
          src="/img/logo-samping.png"
          alt="Logo"
          className="w-40 h-auto mx-auto"
        />
      </div>
      <nav className="space-y-4">
        <Link to="/admin" className={linkClass("/admin")}>
          <FaTachometerAlt /> Dashboard
        </Link>

        <Link to="/admin/users" className={linkClass("/admin/users")}>
          <FaUsers /> Users
        </Link>

        <Link to="/admin/rooms" className={linkClass("/admin/rooms")}>
          <FaBed /> Rooms
        </Link>

        <Link to="/admin/bookings" className={linkClass("/admin/bookings")}>
          <FaClipboardList /> Bookings
        </Link>

        <Link to="/admin/profile" className={linkClass("/admin/profile")}>
          <FaUserCircle /> Profile
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition w-full pl-3"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
