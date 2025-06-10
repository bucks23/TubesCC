import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./layouts/Navbar";
import { useNavigate } from "react-router-dom";

function Booking() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const dummyRoom = {
    id: 1,
    room_type: "Deluxe Room",
    price: 450000,
    description: "Kamar nyaman dengan pemandangan laut.",
  };

  const dummyUser = {
    id: 101,
    username: "rifkinasss",
  };

  const [room, setRoom] = useState(null);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
  });

  useEffect(() => {
    setRoom(dummyRoom);
    setUser(dummyUser);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!room || !user)
      return alert("Data kamar atau pengguna tidak tersedia.");

    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const timeDiff = checkOutDate - checkInDate;
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));

    const total = days * room.price;

    navigate("/payment", {
      state: {
        username: user.username,
        roomType: room.room_type,
        price: room.price,
        days,
        total,
      },
    });
  };

  if (!room || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 text-xl">
        Memuat data...
      </div>
    );
  }

  return (
    <>
      <Navbar />

      {/* Konten utama */}
      <main
        className={`min-h-screen bg-indigo-600 py-20 px-4 sm:px-6 lg:px-8 transition-all duration-300`}
      >
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Formulir Pemesanan Kamar
          </h1>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-800">
                Informasi Pengguna
              </h2>
              <p>
                Nama Pengguna: <strong>{user.username}</strong>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800">
                Detail Kamar
              </h2>
              <p>Tipe: {room.room_type}</p>
              <p>Harga: Rp {room.price.toLocaleString("id-ID")} / malam</p>
              <p>Deskripsi: {room.description}</p>
            </section>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="checkIn"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tanggal Check-In
                </label>
                <input
                  type="date"
                  name="checkIn"
                  id="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label
                  htmlFor="checkOut"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tanggal Check-Out
                </label>
                <input
                  type="date"
                  name="checkOut"
                  id="checkOut"
                  value={formData.checkOut}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
              >
                Pesan Sekarang
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

export default Booking;
