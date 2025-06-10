import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./layouts/Navbar";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    username = "unknown",
    roomType = "unknown",
    price = 0,
    days = 0,
    total = 0,
  } = location.state || {};

  const [cardNumber, setCardNumber] = useState("");

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "");
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.substring(i, i + 4));
    }
    return parts.join("-");
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handlePayment = (e) => {
    e.preventDefault();
    if (!cardNumber || cardNumber.length < 19) {
      return alert("Masukkan nomor kartu kredit yang valid!");
    }

    // Simulasi pembayaran
    alert("Pembayaran berhasil!");
    navigate("/"); // atau redirect ke halaman sukses
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-indigo-600 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            Metode Pembayaran
          </h2>

          <div className="space-y-2 text-gray-700 mb-6">
            <p>
              <span className="font-semibold">Nama Pengguna:</span> {username}
            </p>
            <p>
              <span className="font-semibold">Tipe Kamar:</span> {roomType}
            </p>
            <p>
              <span className="font-semibold">Jumlah Hari:</span> {days}
            </p>
            <p>
              <span className="font-semibold">Harga per Malam:</span> Rp{" "}
              {price.toLocaleString("id-ID")}
            </p>
            <p>
              <span className="font-semibold">Total:</span> Rp{" "}
              {total.toLocaleString("id-ID")}
            </p>
          </div>

          <form onSubmit={handlePayment}>
            <label
              htmlFor="cardNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nomor Kartu Kredit
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={cardNumber}
              onChange={handleCardNumberChange}
              maxLength="19"
              placeholder="XXXX-XXXX-XXXX-XXXX"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

            <button
              type="submit"
              className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition duration-200"
            >
              Bayar Sekarang
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default Payment;
