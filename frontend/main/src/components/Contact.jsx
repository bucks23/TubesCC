import Navbar from "./layouts/Navbar";

function Contact() {
  return (
    <>
      <Navbar />
      <div className="hero min-h-screen bg-gray-900 pt-20">
        <div className="hero-content flex-col items-center text-center">
          <div className="card w-full max-w-5xl shadow-2xl bg-white p-10 rounded-2xl text-left">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Hubungi Kami
              </h1>
              <p className="text-gray-500">
                Jika ada pertanyaan, kritik, atau saran - jangan ragu untuk
                menghubungi kami!
              </p>
            </div>

            <form className="w-full flex flex-col lg:flex-row gap-8">
              {/* Kiri: Nama & Email */}
              <div className="w-full lg:w-1/2 space-y-4">
                <div className="form-control">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nama
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="input input-bordered w-full focus:ring-2 focus:ring-primary"
                    placeholder="Masukkan nama Anda"
                  />
                </div>
                <div className="form-control">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="input input-bordered w-full focus:ring-2 focus:ring-primary"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              {/* Kanan: Pesan */}
              <div className="w-full lg:w-1/2">
                <div className="form-control h-full">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Pesan
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    className="textarea textarea-bordered w-full h-full focus:ring-2 focus:ring-primary"
                    placeholder="Tuliskan pesan Anda di sini..."
                  ></textarea>
                </div>
              </div>
            </form>

            <div className="form-control mt-8">
              <button
                type="submit"
                className="btn bg-violet-700 hover:bg-violet-800 text-white w-full transition duration-300 ease-in-out"
              >
                Kirim Pesan
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
