import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./layouts/sidebar";
import {
  FaEdit,
  FaTrash,
  FaSortAlphaDown,
  FaSortAlphaUp,
} from "react-icons/fa";

const RoomsTable = () => {
  const [rooms, setRooms] = useState([]);
  const [displayedRooms, setDisplayedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortAsc, setSortAsc] = useState(true);
  const [sortCapacityAsc, setSortCapacityAsc] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRooms = async () => {
    try {
      const response = await axios.get(
        "https://web-production-f02bf.up.railway.app/https://adventurous-motivation-production.up.railway.app/api/rooms"
      );
      setRooms(response.data);
      setDisplayedRooms(response.data);
    } catch (error) {
      console.error("Gagal mengambil data ruangan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleSortByName = () => {
    const sorted = [...displayedRooms].sort((a, b) =>
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
    setDisplayedRooms(sorted);
    setSortAsc(!sortAsc);
  };

  const handleSortByCapacity = () => {
    const sorted = [...displayedRooms].sort((a, b) =>
      sortCapacityAsc ? a.capacity - b.capacity : b.capacity - a.capacity
    );
    setDisplayedRooms(sorted);
    setSortCapacityAsc(!sortCapacityAsc);
  };

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchTerm(keyword);
    const filtered = rooms.filter((room) =>
      room.name.toLowerCase().includes(keyword)
    );
    setDisplayedRooms(filtered);
  };

  const handleEdit = (roomId) => {
    alert(`Edit room ${roomId}`);
    // Implementasi modal atau navigasi edit
  };

  const handleDelete = async (roomId) => {
    if (window.confirm("Yakin ingin menghapus ruangan ini?")) {
      try {
        await axios.delete(
          `https://web-production-f02bf.up.railway.app/https://adventurous-motivation-production.up.railway.app/api/rooms/${roomId}`
        );
        setRooms((prev) => prev.filter((room) => room._id !== roomId));
        setDisplayedRooms((prev) => prev.filter((room) => room._id !== roomId));
      } catch (error) {
        console.error("Gagal menghapus ruangan:", error);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Daftar Ruangan</h1>
          <input
            type="text"
            placeholder="Cari ruangan..."
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
                  <th className="px-4 py-2">ID Kamar</th>
                  <th
                    className="px-4 py-2 cursor-pointer select-none"
                    onClick={handleSortByName}
                  >
                    Nama Ruangan{" "}
                    {sortAsc ? (
                      <FaSortAlphaDown className="inline ml-1" />
                    ) : (
                      <FaSortAlphaUp className="inline ml-1" />
                    )}
                  </th>
                  <th className="px-4 py-2">Tipe</th>
                  <th className="px-4 py-2">Harga</th>
                  <th
                    className="px-4 py-2 cursor-pointer select-none"
                    onClick={handleSortByCapacity}
                  >
                    Status{" "}
                    {sortCapacityAsc ? (
                      <FaSortAlphaDown className="inline ml-1" />
                    ) : (
                      <FaSortAlphaUp className="inline ml-1" />
                    )}
                  </th>
                  <th className="px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {displayedRooms.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-gray-500">
                      Tidak ada data.
                    </td>
                  </tr>
                ) : (
                  displayedRooms.map((room) => (
                    <tr key={room.room_number} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{room.room_number}</td>
                      <td className="px-4 py-2">{room.description}</td>
                      <td className="px-4 py-2">{room.room_type}</td>
                      <td className="px-4 py-2">
                        Rp{room.price?.toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-2">{room.status}</td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          onClick={() => handleEdit(room._id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(room._id)}
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

export default RoomsTable;
