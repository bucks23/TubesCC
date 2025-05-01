import { FaSearch } from "react-icons/fa";

const Landing = () => {
  return (
    <>
      <div
        className="hero min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: "url('/img/hero2.jpg')",
          backgroundSize: "cover",
        }}
      >
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold text-white">Booking Me</h1>
            <p className="py-6 text-white">
              Pesan Reservasi Kamar Hotel dengan simpel dan mudah
            </p>
            <button className="btn btn-primary">Pesan Sekarang</button>
          </div>
        </div>
      </div>
      <section className="bg-gray-200 p-6 rounded shadow-md max-w-4xl mx-auto mt-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Room Type & Guests */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Room Type</label>
            <select className="input input-bordered w-full" defaultValue="">
              <option value="" disabled>
                Select room type
              </option>
              <option value="standard">Standard</option>
              <option value="deluxe">Deluxe</option>
              <option value="suite">Suite</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-1">Guests</label>
            <select className="input input-bordered w-full" defaultValue="">
              <option value="" disabled>
                Number of guests
              </option>
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="3">3 Guests</option>
              <option value="4">4 Guests</option>
              <option value="5">5 Guests</option>
            </select>
          </div>

          {/* Check In & Check Out */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Check in</label>
            <input type="date" className="input input-bordered w-full" />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Check Out</label>
            <input type="date" className="input input-bordered w-full" />
          </div>
        </div>

        <button className="btn w-full bg-indigo-500 hover:bg-indigo-600 text-white text-lg mt-3">
          <FaSearch className="mr-2" /> Search
        </button>
      </section>
    </>
  );
};

export default Landing;
