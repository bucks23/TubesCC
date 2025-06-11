import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./layouts/Sidebar";
import {
  FaEdit,
  FaTrash,
  FaSortNumericDown,
  FaSortNumericUp,
} from "react-icons/fa";


const BookingsTable = () => {
  const [bookings, setBookings] = useState([]);
  const [displayedBookings, setDisplayedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortByDateAsc, setSortByDateAsc] = useState(true);
  const [sortByPriceAsc, setSortByPriceAsc] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        "https://web-production-f02bf.up.railway.app/https://adventurous-motivation-production.up.railway.app/api/booking"
      );
      setBookings(response.data);
      setDisplayedBookings(response.data);
    } catch (error) {
      console.error("Gagal mengambil data booking:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSortByDate = () => {
    const sorted = [...displayedBookings].sort((a, b) => {
      return sortByDateAsc
        ? new Date(a.checkin_date) - new Date(b.checkin_date)
        : new Date(b.checkin_date) - new Date(a.checkin_date);
    });
    setDisplayedBookings(sorted);
    setSortByDateAsc(!sortByDateAsc);
  };

  const handleSortByPrice = () => {
    const sorted = [...displayedBookings].sort((a, b) =>
      sortByPriceAsc
        ? a.total_price - b.total_price
        : b.total_price - a.total_price
    );
    setDisplayedBookings(sorted);
    setSortByPriceAsc(!sortByPriceAsc);
  };

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchTerm(keyword);
    const filtered = bookings.filter(
      (booking) =>
        booking.user_id.toString().includes(keyword) ||
        booking.room_id.toString().includes(keyword)
    );
    setDisplayedBookings(filtered);
  };

  const handleEdit = (id) => {
    alert(`Edit booking ${id}`);
    // Tambahkan modal/navigasi edit
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus booking ini?")) {
      try {
        await axios.delete(
          `https://web-production-f02bf.up.railway.app/https://adventurous-motivation-production.up.railway.app/api/booking/${id}`
        );
        setBookings((prev) => prev.filter((b) => b.id !== id));
        setDisplayedBookings((prev) => prev.filter((b) => b.id !== id));
      } catch (error) {
        console.error("Gagal menghapus booking:", error);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Daftar Booking</h1>
          <input
            type="text"
            placeholder="Cari user_id atau room_id..."
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
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">User ID</th>
                  <th className="px-4 py-2">Room ID</th>
                  <th
                    className="px-4 py-2 cursor-pointer"
                    onClick={handleSortByDate}
                  >
                    Check-In{" "}
                    {sortByDateAsc ? (
                      <FaSortNumericDown className="inline ml-1" />
                    ) : (
                      <FaSortNumericUp className="inline ml-1" />
                    )}
                  </th>
                  <th className="px-4 py-2">Check-Out</th>
                  <th
                    className="px-4 py-2 cursor-pointer"
                    onClick={handleSortByPrice}
                  >
                    Total Harga{" "}
                    {sortByPriceAsc ? (
                      <FaSortNumericDown className="inline ml-1" />
                    ) : (
                      <FaSortNumericUp className="inline ml-1" />
                    )}
                  </th>
                  <th className="px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {displayedBookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
                      Tidak ada data.
                    </td>
                  </tr>
                ) : (
                  displayedBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{booking.id}</td>
                      <td className="px-4 py-2">{booking.user_id}</td>
                      <td className="px-4 py-2">{booking.room_id}</td>
                      <td className="px-4 py-2">{booking.checkin_date}</td>
                      <td className="px-4 py-2">{booking.checkout_date}</td>
                      <td className="px-4 py-2">
                        Rp{booking.total_price.toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          onClick={() => handleEdit(booking.id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(booking.id)}
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

export default BookingsTable;
