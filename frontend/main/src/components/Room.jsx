import Navbar from "./layouts/Navbar";
import React, { useEffect, useState } from "react";

function Room() {
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/rooms/")
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch((err) => console.error("Gagal fetch data kamar:", err));
  }, []);

  const filteredRooms = rooms.filter((room) => {
    const term = searchTerm.toLowerCase();
    return (
      room.room_number.toLowerCase().includes(term) ||
      room.room_type.toLowerCase().includes(term) ||
      room.description.toLowerCase().includes(term)
    );
  });

  return (
    <>
      <Navbar />
      <div className="hero min-h-screen bg-gray-900 pt-20">
        <div className="hero-content flex-col items-center text-center">
          <div className="card w-full max-w-6xl shadow-2xl bg-white p-10 rounded-2xl text-left">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Cari Kamar Hotel
              </h1>
              <p className="text-gray-500">
                Temukan kamar yang sesuai dengan kebutuhan Anda!
              </p>
            </div>

            {/* Form Pencarian Placeholder */}
            <form
              className="w-full flex flex-col lg:flex-row gap-6 mb-10"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="text"
                placeholder="Cari kamar berdasarkan nomor, tipe, atau deskripsi..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn bg-violet-700 text-white" type="submit">
                Cari
              </button>
            </form>

            {/* Hasil Data Kamar */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room) => (
                <div key={room.id} className="card shadow-md bg-gray-100">
                  <figure>
                    <img
                      src={`https://source.unsplash.com/400x300/?hotel,room,${room.room_type}`}
                      alt={room.room_type}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">{room.room_type} Room</h2>
                    <p className="text-sm text-gray-600">{room.description}</p>
                    <p className="text-sm text-gray-500">
                      No Kamar: {room.room_number}
                    </p>
                    <p className="text-violet-700 font-semibold">
                      Rp {room.price.toLocaleString("id-ID")} / malam
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        room.status === "Available"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {room.status}
                    </p>
                    <div className="card-actions justify-end">
                      <button
                        className="btn btn-sm btn-primary"
                        disabled={room.status !== "Available"}
                      >
                        {room.status === "Available"
                          ? "Pesan Sekarang"
                          : "Tidak Tersedia"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredRooms.length === 0 && (
              <div className="text-center text-gray-500 mt-10">
                Tidak ada kamar yang cocok dengan pencarian.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Room;
