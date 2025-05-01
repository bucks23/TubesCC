import { useState } from "react";
import Navbar from "./layouts/Navbar";

function Register() {
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [userList, setUserList] = useState([]);

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: userName, password }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Login gagal: ${response.status} - ${errText}`);
      }

      const data = await response.json();
      setUserName(data.name);
      setError("");
      setShowModal(true);
    } catch (err) {
      setError(err.message);
      setUserName("");
      setShowModal(false);
    }
  };

  const handleCheckUser = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil data user");
      }

      const data = await response.json();
      setUserList(data);
      setShowModal(true);
    } catch (error) {
      setError(error.message);
      setShowModal(true);
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
              <h1 className="text-xl font-bold">Register</h1>
              <p className="text-sm text-gray-500">
                Silahkan register untuk melanjutkan
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
                    placeholder="Username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-left text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    className="input input-bordered w-full"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="text-right">
                  <a className="link link-hover text-sm">Forgot password?</a>
                </div>
                <button
                  className="btn btn-neutral w-full mt-4"
                  onClick={handleRegister}
                >
                  Login
                </button>
                or
                <button
                  className="btn btn-neutral w-full mt-4"
                  onClick={handleCheckUser}
                >
                  Check User
                </button>
              </fieldset>

              {error && (
                <p className="text-red-500 mt-4">Gagal Register: {error}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Register Berhasil</h2>
            <p>
              Username <strong>{userName}</strong> telah berhasil mendaftar.
            </p>
            <button
              className="btn btn-primary mt-4"
              onClick={() => setShowModal(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">
              Daftar Pengguna
            </h2>
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <ol className="list-decimal pl-5 space-y-1 max-h-60 overflow-y-auto">
                {userList.map((user, index) => (
                  <li key={index}>{user.name || user.username}</li>
                ))}
              </ol>
            )}
            <button
              onClick={() => setShowModal(false)}
              className="btn mt-4 btn-error w-full"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Register;
