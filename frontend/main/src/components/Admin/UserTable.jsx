import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./layouts/Sidebar";
import {
  FaEdit,
  FaTrash,
  FaSortAlphaDown,
  FaSortAlphaUp,
} from "react-icons/fa";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortAsc, setSortAsc] = useState(true);
  const [sortRoleAsc, setSortRoleAsc] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://web-production-f02bf.up.railway.app/https://adventurous-motivation-production.up.railway.app/api/auth/admin/users"
      );
      setUsers(response.data);
      setDisplayedUsers(response.data);
    } catch (error) {
      console.error("Gagal mengambil data users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSort = () => {
    const sorted = [...displayedUsers].sort((a, b) =>
      sortAsc
        ? a.username.localeCompare(b.username)
        : b.username.localeCompare(a.username)
    );
    setDisplayedUsers(sorted);
    setSortAsc(!sortAsc);
  };

  const handleSortRole = () => {
    const sorted = [...displayedUsers].sort((a, b) =>
      sortRoleAsc ? a.role.localeCompare(b.role) : b.role.localeCompare(a.role)
    );
    setDisplayedUsers(sorted);
    setSortRoleAsc(!sortRoleAsc);
  };

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchTerm(keyword);
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(keyword)
    );
    setDisplayedUsers(filtered);
  };

  const handleEdit = (userId) => {
    alert(`Edit user ${userId}`);
    // Tambahkan logika navigasi atau modal di sini
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Yakin ingin menghapus user ini?")) {
      try {
        await axios.delete(
          `https://web-production-f02bf.up.railway.app/https://adventurous-motivation-production.up.railway.app/api/auth/admin/users/${userId}`
        );
        setUsers((prev) => prev.filter((user) => user._id !== userId));
        setDisplayedUsers((prev) => prev.filter((user) => user._id !== userId));
      } catch (error) {
        console.error("Gagal menghapus user:", error);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Daftar Pengguna</h1>
          <input
            type="text"
            placeholder="Cari username..."
            value={searchTerm}
            onChange={handleSearch}
            className="border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <p>Memuat data...</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
            <table className="min-w-full text-sm text-left table-auto">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2">No</th>
                  <th
                    className="px-4 py-2 cursor-pointer select-none"
                    onClick={handleSort}
                  >
                    Username{" "}
                    {sortAsc ? (
                      <FaSortAlphaDown className="inline ml-1" />
                    ) : (
                      <FaSortAlphaUp className="inline ml-1" />
                    )}
                  </th>
                  <th
                    className="px-4 py-2 cursor-pointer select-none"
                    onClick={handleSortRole}
                  >
                    Role{" "}
                    {sortRoleAsc ? (
                      <FaSortAlphaDown className="inline ml-1" />
                    ) : (
                      <FaSortAlphaUp className="inline ml-1" />
                    )}
                  </th>
                  <th className="px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {displayedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                      Tidak ada data.
                    </td>
                  </tr>
                ) : (
                  displayedUsers.map((user, index) => (
                    <tr key={user._id || index} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{user.username}</td>
                      <td className="px-4 py-2 capitalize">{user.role}</td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          onClick={() => handleEdit(user._id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Hapus"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersTable;
