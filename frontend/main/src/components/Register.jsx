import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./layouts/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiUser, FiLock } from "react-icons/fi";
import axios from "axios";

function Register() {
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!userName.trim() || !password.trim()) {
      toast.error("Username dan password harus diisi");
      return;
    }
    if (userName.length < 3) {
      toast.error("Username minimal 3 karakter");
      return;
    }
    if (password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://web-production-f02bf.up.railway.app/https://adventurous-motivation-production.up.railway.app/api/auth/register",
        {
          username: userName.trim(),
          password: password.trim(),
          role: "guest",
        body: JSON.stringify({
          username: userName.trim(),
          password: password.trim(),
          role: "guest",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || `Registration failed: ${response.status}`
        );
      }

      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      toast.success(`User ${data.user.username} berhasil terdaftar!`);
      setUserName("");
      setPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div
        className="hero min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/img/login.jpg')" }}
      >
        <div className="hero-overlay bg-black/60 backdrop-blur-sm"></div>
        <div className="hero-content text-center text-neutral-content w-full flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md bg-white/10 p-8 rounded-2xl shadow-xl backdrop-blur-md border border-white/20">
            <h1 className="text-3xl font-semibold mb-2 text-white tracking-wider">
              Buat Akun
            </h1>
            <p className="mb-6 text-white/70">
              Silahkan isi data untuk membuat akun baru
            </p>

            <div className="space-y-5">
              <div className="flex items-center bg-white/10 rounded-lg px-3 py-2">
                <FiUser className="text-white/70 mr-2" />
                <input
                  type="text"
                  className="bg-transparent w-full text-white placeholder-white/70 outline-none"
                  placeholder="Username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="flex items-center bg-white/10 rounded-lg px-3 py-2">
                <FiLock className="text-white/70 mr-2" />
                <input
                  type="password"
                  className="bg-transparent w-full text-white placeholder-white/70 outline-none"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <button
                className={`btn btn-outline w-full py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-lg transition ${
                  loading ? "loading" : ""
                }`}
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? "Loading..." : "Register"}
              </button>

              <div className="text-sm text-white/70">Sudah punya akun?</div>
              <Link
                to="/login"
                className="btn btn-outline w-full py-3 bg-gray-600 hover:bg-indigo-800 text-white font-semibold rounded-lg transition"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
