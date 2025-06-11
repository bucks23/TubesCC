import React, { useEffect, useState } from "react";
import Sidebar from "./layouts/sidebar";
import axios from "axios";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://web-production-f02bf.up.railway.app/https://adventurous-motivation-production.up.railway.app/api/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAdmin(response.data);
    } catch (error) {
      console.error("Gagal mengambil data profil admin:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Profil Admin</h1>

        {loading ? (
          <p>Memuat data profil...</p>
        ) : !admin ? (
          <p className="text-red-500">Data tidak tersedia.</p>
        ) : (
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Informasi Akun</h2>
              <p>
                <strong>Username:</strong> {admin.username}
              </p>
              <p>
                <strong>Email:</strong> {admin.email || "-"}
              </p>
              <p>
                <strong>Role:</strong> {admin.role}
              </p>
              <p>
                <strong>Dibuat pada:</strong>{" "}
                {new Date(admin.createdAt).toLocaleString()}
              </p>
            </div>

            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Edit Profil
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
