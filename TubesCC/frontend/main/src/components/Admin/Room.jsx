import React, { useEffect, useState } from "react";
import Navbar from "../layouts/Navbar";

function RoomAdmin() {
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newRoom, setNewRoom] = useState({
    room_number: "",
    room_type: "",
    description: "",
    price: "",
    status: "Available",
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = () => {
    fetch("http://localhost:5000/api/rooms/")
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch((err) => console.error("Gagal fetch data kamar:", err));
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/rooms/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRoom),
      });

      if (!response.ok) {
        throw new Error("Gagal menambahkan kamar");
      }

      // Reset form & refresh data
      setNewRoom({
        room_number: "",
        room_type: "",
        description: "",
        price: "",
        status: "Available",
      });
      document.getElementById("tambah_kamar_modal").close();
      fetchRooms();
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
                Kelola Kamar Hotel
              </h1>
              <p className="text-gray-500">
                Tambah, cari, dan kelola daftar kamar hotel.
              </p>
            </div>

            {/* Form Pencarian & Button Tambah */}
            <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
              <input
                type="text"
                placeholder="Cari kamar..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="btn btn-success text-white lg:w-auto"
                onClick={() =>
                  document.getElementById("tambah_kamar_modal").showModal()
                }
              >
                + Tambah Kamar
              </button>
            </div>

            {/* Data Kamar */}
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

      {/* MODAL TAMBAH KAMAR */}
      <dialog id="tambah_kamar_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Tambah Kamar Baru</h3>

          <form className="space-y-3" onSubmit={handleAddRoom}>
            <input
              type="text"
              placeholder="Nomor Kamar"
              className="input input-bordered w-full"
              value={newRoom.room_number}
              onChange={(e) =>
                setNewRoom({ ...newRoom, room_number: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Tipe Kamar"
              className="input input-bordered w-full"
              value={newRoom.room_type}
              onChange={(e) =>
                setNewRoom({ ...newRoom, room_type: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Deskripsi"
              className="textarea textarea-bordered w-full"
              value={newRoom.description}
              onChange={(e) =>
                setNewRoom({ ...newRoom, description: e.target.value })
              }
              required
            ></textarea>
            <input
              type="number"
              placeholder="Harga"
              className="input input-bordered w-full"
              value={newRoom.price}
              onChange={(e) =>
                setNewRoom({ ...newRoom, price: e.target.value })
              }
              required
            />
            <select
              className="select select-bordered w-full"
              value={newRoom.status}
              onChange={(e) =>
                setNewRoom({ ...newRoom, status: e.target.value })
              }
            >
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>

            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() =>
                  document.getElementById("tambah_kamar_modal").close()
                }
              >
                Batal
              </button>
              <button type="submit" className="btn btn-primary">
                Simpan
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}

export default RoomAdmin;
