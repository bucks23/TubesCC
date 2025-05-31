import Navbar from "./layouts/Navbar";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, message } = formData;

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Mohon isi semua field sebelum mengirim pesan!");
      return;
    }

    // Submit action here (e.g., API call)

    toast.success("Pesan berhasil dikirim!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-indigo-600 flex flex-col pt-24 px-4 md:px-8">
        <div className="max-w-3xl mx-auto w-full bg-white rounded-xl shadow-md p-10">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
              Hubungi Kami
            </h1>
            <p className="text-gray-600 text-lg">
              Jika ada pertanyaan, kritik, atau saran - jangan ragu untuk
              menghubungi kami!
            </p>
            <div className="text-gray-700 text-sm md:text-base space-y-1">
              <p>
                <span className="font-semibold">Contact Person:</span> +62
                812-3456-7890
              </p>
              <p>
                <span className="font-semibold">Email:</span> contact@domain.com
              </p>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Nama
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Masukkan nama Anda"
                  autoComplete="off"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="example@email.com"
                  autoComplete="off"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Pesan
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Tuliskan pesan Anda di sini..."
              ></textarea>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md px-16 py-3 shadow-sm transition"
              >
                Kirim Pesan
              </button>
            </div>
          </form>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </>
  );
}

export default Contact;
