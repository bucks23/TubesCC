import Navbar from "./layouts/Navbar";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Booking() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    telepon: "",
    tanggalCheckIn: "",
    tanggalCheckOut: "",
  });

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(
          `https://web-production-f02bf.up.railway.app/https://adventurous-motivation-production.up.railway.app/api/booking`
        );
        setRoom(response.data);
      } catch (err) {
        console.error("Gagal fetch data kamar:", err);
        setError("Gagal memuat data kamar. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Tambahkan logika untuk mengirim data pemesanan ke server
    console.log("Data Pemesanan:", formData);
    alert("Pemesanan berhasil!"); // Contoh sederhana
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-2xl font-semibold text-gray-700">Memuat data...</p>
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

  if (!room) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-xl">Kamar tidak ditemukan.</p>
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
              Formulir Pemesanan Kamar
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Isi formulir di bawah ini untuk menyelesaikan pemesanan kamar
              Anda.
            </p>
          </header>

          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Detail Kamar
            </h2>
            <p>Tipe Kamar: {room.room_type}</p>
            <p>Nomor Kamar: {room.room_number}</p>
            <p>Harga: Rp {room.price.toLocaleString("id-ID")} / malam</p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              Informasi Pribadi
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="nama"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="nama"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Alamat Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="telepon"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  id="telepon"
                  name="telepon"
                  value={formData.telepon}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="tanggalCheckIn"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tanggal Check-In
                </label>
                <input
                  type="date"
                  id="tanggalCheckIn"
                  name="tanggalCheckIn"
                  value={formData.tanggalCheckIn}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="tanggalCheckOut"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tanggal Check-Out
                </label>
                <input
                  type="date"
                  id="tanggalCheckOut"
                  name="tanggalCheckOut"
                  value={formData.tanggalCheckOut}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Pesan Sekarang
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}

export default Booking;
