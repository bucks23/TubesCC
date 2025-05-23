import { useState } from "react";
import Navbar from "./layouts/Navbar";

function Login() {
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!userName.trim() || !password.trim()) {
      setError("Username dan password harus diisi");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userName.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Login failed: ${response.status}`);
      }

      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setSuccess("Login berhasil!");
      setUserName("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="hero min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/img/login.jpg')" }}
      >
        <div className="hero-content flex flex-col items-center justify-center text-center mt-10">
          <div className="card bg-base-100 w-full max-w-lg shadow-2xl m-10 p-8 rounded-lg">
            <div className="card-header p-5">
              <h1 className="text-xl font-bold">Login</h1>
              <p className="text-sm text-gray-500">
                Masukkan akun Anda untuk masuk
              </p>
            </div>
            <div className="card-body justify-start">
              <fieldset className="space-y-4">
                <div>
                  <label className="block text-left text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Masukkan username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-left text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    className="input input-bordered w-full"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <button
                  className={`btn btn-neutral w-full mt-4 ${loading ? "loading" : ""}`}
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Login"}
                </button>
              </fieldset>

              {error && (
                <div className="alert alert-error mt-4">
                  <span>Error: {error}</span>
                </div>
              )}

              {success && (
                <div className="alert alert-success mt-4">
                  <span>{success}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
