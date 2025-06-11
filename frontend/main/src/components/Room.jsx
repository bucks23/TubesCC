import Navbar from "./layouts/Navbar";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Room() {
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "https://web-production-f02bf.up.railway.app/https://adventurous-motivation-production.up.railway.app/api/rooms"
      );
      setRooms(response.data);
    } catch (err) {
      console.error("Gagal fetch data kamar:", err);
      setError("Gagal memuat data kamar. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const debouncedSetSearchTerm = useCallback(
    (value) => {
      setSearchTerm(value);
    },
    [setSearchTerm]
  );

  const filteredRooms = rooms.filter((room) => {
    const term = searchTerm.toLowerCase();
    return (
      room.room_number.toLowerCase().includes(term) ||
      room.room_type.toLowerCase().includes(term) ||
      room.description.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-2xl font-semibold text-gray-700">Memuat kamar...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-indigo-600 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <section className="max-w-7xl mx-auto bg-white rounded-3xl shadow-lg p-12">
          <header className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
              Cari Kamar Hotel
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Temukan kamar yang sesuai dengan kebutuhan Anda dengan mudah dan
              cepat.
            </p>
          </header>

          {/* Search form */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4 mb-12"
          >
            <input
              type="text"
              placeholder="Cari kamar berdasarkan nomor, tipe, atau deskripsi..."
              value={searchTerm}
              onChange={(e) => debouncedSetSearchTerm(e.target.value)}
              className="flex-grow border border-gray-300 rounded-xl px-5 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl px-6 py-3 transition"
            >
              Cari
            </button>
          </form>

          {/* Room grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room) => (
              <RoomItem key={room.id} room={room} />
            ))}
          </div>

          {filteredRooms.length === 0 && (
            <p className="text-center text-gray-400 mt-16 text-lg">
              Tidak ada kamar yang cocok dengan pencarian.
            </p>
          )}
        </section>
      </main>
    </>
  );
}

function RoomItem({ room }) {
  const navigate = useNavigate();

  const handleBookingClick = () => {
    if (room.status !== "Available") return;

    navigate("/booking");
  };

  return (
    <article className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-0 overflow-hidden flex flex-col">
      <img
        src={`https://source.unsplash.com/400x300/?hotel,room,${room.room_type}`}
        alt={room.room_type}
        className="w-full h-48 object-cover"
      />
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {room.room_type} Room
        </h2>
        <p className="text-gray-600 flex-grow mb-4">{room.description}</p>
        <p className="text-gray-500 text-sm mb-1">
          No Kamar: {room.room_number}
        </p>
        <p className="text-indigo-600 font-bold text-lg mb-2">
          Rp {room.price.toLocaleString("id-ID")} / malam
        </p>
        <p
          className={`text-sm font-medium mb-4 ${
            room.status === "Available" ? "text-green-600" : "text-red-600"
          }`}
        >
          {room.status}
        </p>
        <button
          onClick={handleBookingClick}
          disabled={room.status !== "Available"}
          className={`mt-auto w-full py-3 rounded-xl font-semibold transition text-center
            ${
              room.status === "Available"
                ? "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          {room.status === "Available" ? "Pesan Sekarang" : "Tidak Tersedia"}
        </button>
      </div>
    </article>
  );
}

export default Room;
