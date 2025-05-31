"use client";

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaSwimmingPool,
  FaDumbbell,
  FaUtensils,
  FaWifi,
  FaRocket,
  FaConciergeBell,
  FaMoneyCheckAlt,
  FaMapMarkedAlt,
} from "react-icons/fa";

const Landing = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [guests, setGuests] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/rooms/")
      .then((res) => res.json())
      .then((data) => setRoomTypes(data))
      .catch((err) => console.error("Failed to fetch rooms:", err));
  }, []);

  const handleSearch = () => {
    if (selectedRoomType && guests && checkIn && checkOut) {
      navigate(
        `/room?type=${encodeURIComponent(
          selectedRoomType
        )}&guests=${guests}&checkin=${checkIn}&checkout=${checkOut}`
      );
    } else {
      toast.warning("Mohon lengkapi semua form!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  const formRef = useRef(null);

  const handleScrollToForm = () => {
    if (!formRef.current) return;

    const yOffset = -120;
    const y =
      formRef.current.getBoundingClientRect().top +
      window.pageYOffset +
      yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <>
      <div
        className="hero min-h-screen bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/img/hero2.jpg')",
          height: "500px",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30  to-black/50" />
        <div className="hero-content text-center relative z-10">
          <div className="max-w-xl mx-auto text-white">
            <h1 className="text-6xl font-extralight tracking-wide mb-4">
              <span className="font-semibold">Pacific Up</span>
            </h1>
            <p className="text-lg text-white text-opacity-90">
              Temukan pengalaman menginap terbaik dengan reservasi cepat dan
              nyaman.
            </p>
            <button
              className="mt-6 px-6 py-3 bg-white text-indigo-700 font-medium rounded-lg shadow hover:bg-indigo-100 transition"
              onClick={handleScrollToForm}
            >
              Pesan Sekarang
            </button>
          </div>
        </div>
      </div>

      <section
        ref={formRef}
        className="bg-white shadow-lg rounded-xl max-w-5xl mx-auto p-6 mt-[-4rem] relative z-20 mb-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Room Type */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Room Type</label>
            <select
              className="input input-bordered w-full"
              value={selectedRoomType}
              onChange={(e) => setSelectedRoomType(e.target.value)}
            >
              <option value="" disabled>
                Pilih tipe kamar
              </option>
              {roomTypes.map((room) => (
                <option key={room.id} value={room.name}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>

          {/* Guests */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Guests</label>
            <select
              className="input input-bordered w-full"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            >
              <option value="" disabled>
                Jumlah tamu
              </option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} Tamu
                </option>
              ))}
            </select>
          </div>

          {/* Check In */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Check In</label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>

          {/* Check Out */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Check Out</label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
        </div>

        <button
          className="btn w-full bg-indigo-500 hover:bg-indigo-600 text-white text-lg mt-3"
          onClick={handleSearch}
        >
          <FaSearch className="mr-2" /> Search
        </button>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Kenapa Memilih <span className="text-indigo-600">Pacific Up</span>?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Fitur 1 */}
          <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition">
            <div className="flex justify-center mb-4 text-indigo-600 text-4xl">
              <FaRocket />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Pemesanan Cepat
            </h3>
            <p className="text-gray-600 text-sm">
              Sistem reservasi instan yang mudah digunakan kapan saja.
            </p>
          </div>

          {/* Fitur 2 */}
          <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition">
            <div className="flex justify-center mb-4 text-indigo-600 text-4xl">
              <FaConciergeBell />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Fasilitas Lengkap
            </h3>
            <p className="text-gray-600 text-sm">
              Dari kolam renang hingga spa, semua tersedia untuk kenyamanan
              Anda.
            </p>
          </div>

          {/* Fitur 3 */}
          <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition">
            <div className="flex justify-center mb-4 text-indigo-600 text-4xl">
              <FaMoneyCheckAlt />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Harga Transparan
            </h3>
            <p className="text-gray-600 text-sm">
              Tanpa biaya tersembunyi — semua tertera dengan jelas.
            </p>
          </div>

          {/* Fitur 4 */}
          <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition">
            <div className="flex justify-center mb-4 text-indigo-600 text-4xl">
              <FaMapMarkedAlt />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Lokasi Strategis
            </h3>
            <p className="text-gray-600 text-sm">
              Dekat pusat kota, bandara, dan destinasi wisata populer.
            </p>
          </div>
        </div>
      </section>

      {/* Halaman Baru */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-indigo-700 mb-4">
            Kenyamanan dan Fasilitas Terbaik
          </h2>
          <p className="text-gray-600 mb-10 text-lg">
            Nikmati berbagai fasilitas premium yang kami sediakan untuk membuat
            pengalaman menginap Anda tak terlupakan.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Kolam Renang */}
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
              <div className="text-indigo-500 text-5xl mb-4">
                <i className="inline-block">
                  <i className="text-indigo-500">
                    <FaSwimmingPool />
                  </i>
                </i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Kolam Renang</h3>
              <p className="text-gray-500 text-sm">
                Kolam renang luas dengan pemandangan laut yang menenangkan.
              </p>
            </div>

            {/* Gym */}
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
              <div className="text-indigo-500 text-5xl mb-4">
                <i className="inline-block">
                  <FaDumbbell />
                </i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Gym Modern</h3>
              <p className="text-gray-500 text-sm">
                Dilengkapi alat fitness lengkap untuk menjaga kebugaran Anda.
              </p>
            </div>

            {/* Restoran */}
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
              <div className="text-indigo-500 text-5xl mb-4">
                <i className="inline-block">
                  <FaUtensils />
                </i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Restoran Elegan</h3>
              <p className="text-gray-500 text-sm">
                Sajian kuliner lokal & internasional dari chef profesional.
              </p>
            </div>

            {/* WiFi */}
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
              <div className="text-indigo-500 text-5xl mb-4">
                <i className="inline-block">
                  <FaWifi />
                </i>
              </div>
              <h3 className="text-xl font-semibold mb-2">WiFi Cepat</h3>
              <p className="text-gray-500 text-sm">
                Akses internet cepat dan stabil di seluruh area hotel.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-indigo-700 text-white py-16 px-10 text-center rounded-xl max-w-6xl mx-auto mt-10 mb-10">
        <h2 className="text-4xl font-bold mb-4">
          Siap untuk pengalaman menginap terbaik?
        </h2>
        <p className="mb-8 text-lg max-w-3xl mx-auto">
          Pesan sekarang dan rasakan kenyamanan serta layanan premium dari
          Pacific Up. Kami siap menyambut Anda dengan pelayanan terbaik.
        </p>
        <button
          onClick={handleScrollToForm}
          className="bg-white text-indigo-700 font-semibold px-8 py-3 rounded-lg hover:bg-indigo-100 transition"
        >
          Pesan Sekarang
        </button>
      </section>
    </>
  );
};

export default Landing;
