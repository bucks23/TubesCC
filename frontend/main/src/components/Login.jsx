import { useState } from "react";
import { FiUser, FiLock } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./layouts/Navbar";
import axios from "axios";

function Login() {
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!userName.trim() || !password.trim()) {
      toast.warn("Username dan password harus diisi", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://web-production-f02bf.up.railway.app/https://adventurous-motivation-production.up.railway.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userName.trim(),
          password: password.trim(),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login gagal");
      }

      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Login berhasil!", {
          position: "top-right",
          autoClose: 3000,
        });

        setUserName("");
        setPassword("");
        window.dispatchEvent(new Event("user-login"));
        navigate("/");
      }
    } catch (err) {
      toast.error(err.message || "Terjadi kesalahan saat login", {
        position: "top-right",
        autoClose: 3000,
      });
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
        <div className="hero-content text-center w-full flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md bg-white/10 p-8 rounded-2xl shadow-xl backdrop-blur-md border border-white/20">
            <h2 className="text-3xl font-semibold mb-2 text-white tracking-wider">
              Selamat Datang
            </h2>
            <p className="text-white/70 mb-6">Masukkan akun Anda untuk masuk</p>

            <div className="space-y-5">
              <div className="flex items-center bg-white/10 rounded-lg px-3 py-2 border border-white/20">
                <FiUser className="text-white/70 mr-2" />
                <input
                  type="text"
                  className="bg-transparent outline-none w-full text-white placeholder-white/70"
                  placeholder="Masukkan username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="flex items-center bg-white/10 rounded-lg px-3 py-2 border border-white/20">
                <FiLock className="text-white/70 mr-2" />
                <input
                  type="password"
                  className="bg-transparent outline-none w-full text-white placeholder-white/70"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className={`w-full py-3 bg-violet-700 hover:bg-violet-800 text-white font-semibold rounded-lg transition ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Memproses..." : "Login"}
              </button>

              <div className="text-center">
                <span className="text-sm text-white/70">Belum punya akun?</span>{" "}
                <Link
                  to="/register"
                  className="text-white font-semibold hover:underline"
                >
                  Daftar Sekarang
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
