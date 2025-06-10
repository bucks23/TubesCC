import Navbar from "./layouts/Navbar";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Modal from "react-modal";

function Booking() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    tanggalCheckIn: "",
    tanggalCheckOut: "",
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [totalHarga, setTotalHarga] = useState(0);
  const [jumlahHari, setJumlahHari] = useState(0);

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `https://web-production-f02bf.up.railway.app/https://adventurous-motivation-production.up.railway.app/api/rooms/${roomId}`
        );
        setRoom(response.data);
      } catch (err) {
        console.error("Gagal fetch data kamar:", err);
        setError("Gagal memuat data kamar. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    // Ambil data user dari localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchRoom();
  }, [roomId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !room) {
      alert("Data user atau kamar tidak tersedia.");
      return;
    }

    const checkIn = new Date(formData.tanggalCheckIn);
    const checkOut = new Date(formData.tanggalCheckOut);

    if (checkOut <= checkIn) {
      alert("Tanggal check-out harus lebih dari tanggal check-in.");
      return;
    }

    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const total = room.price * diffDays;

    const payload = {
      user_id: user.id,
      room_id: room.id,
      checkin_date: formData.tanggalCheckIn,
      checkout_date: formData.tanggalCheckOut,
    };

    try {
      await axios.post(
        `https://web-production-f02bf.up.railway.app/https://adventurous-motivation-production.up.railway.app/api/booking`,
        payload
      );
      setJumlahHari(diffDays);
      setTotalHarga(total);
      setShowPaymentModal(true);
    } catch (err) {
      console.error("Gagal mengirim pemesanan:", err);
      alert("Terjadi kesalahan saat melakukan pemesanan.");
    }
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

  if (!room || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-xl">Data tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-indigo-600 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <section className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-12">
          <header className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
              Formulir Pemesanan Kamar
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Isi tanggal check-in dan check-out untuk menyelesaikan pemesanan.
            </p>
          </header>

          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Informasi Pengguna
              </h2>
              <p>Nama Pengguna: {user.username}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Detail Kamar
              </h2>
              <p>Tipe Kamar: {room.room_type}</p>
              <p>Harga: Rp {room.price.toLocaleString("id-ID")} / malam</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Pesan Sekarang
              </button>
            </form>
          </div>
        </section>
      </main>

      <Modal
        isOpen={showPaymentModal}
        onRequestClose={() => setShowPaymentModal(false)}
        contentLabel="Metode Pembayaran"
        className="max-w-md mx-auto mt-20 bg-white p-6 rounded-lg shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Metode Pembayaran
        </h2>

        <p className="mb-2 text-gray-700">
          Nama Pengguna: <strong>{user.username}</strong>
        </p>
        <p className="mb-2 text-gray-700">
          Tipe Kamar: <strong>{room.room_type}</strong>
        </p>
        <p className="mb-2 text-gray-700">
          Jumlah Hari: <strong>{jumlahHari}</strong> malam
        </p>
        <p className="mb-4 text-gray-700">
          Total Pembayaran:{" "}
          <strong>Rp {totalHarga.toLocaleString("id-ID")}</strong>
        </p>

        <h3 className="text-lg font-medium mb-2 text-gray-800">Credit Card</h3>
        <input
          type="text"
          placeholder="Nomor Kartu Kredit"
          className="w-full p-2 border rounded-md mb-4"
        />
        <button
          onClick={() => {
            alert("Pembayaran berhasil!");
            setShowPaymentModal(false);
          }}
          className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
        >
          Bayar Sekarang
        </button>
      </Modal>
    </>
  );
}

export default Booking;
