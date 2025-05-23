import { useState } from "react";
import { Link } from "react-router-dom"; // Add this import
import Navbar from "./layouts/Navbar";

function Register() {
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "register" or "userlist"
  const [userList, setUserList] = useState([]);

  const handleRegister = async () => {
    // Basic validation
    if (!userName.trim() || !password.trim()) {
      setError("Username dan password harus diisi");
      return;
    }

    if (userName.length < 3) {
      setError("Username minimal 3 karakter");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          username: userName.trim(), 
          password: password.trim(),
          role: "guest" // Default role, you can make this configurable
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Registration failed: ${response.status}`);
      }

      // Store the JWT token if needed
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      setSuccess(`User ${data.user.username} berhasil terdaftar!`);
      setModalType("register");
      setShowModal(true);
      
      // Clear form
      setUserName("");
      setPassword("");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckUser = async () => {
    setLoading(true);
    setError("");

    try {
      // Get access token from localStorage
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");
      }

      const response = await fetch("http://localhost:5000/api/auth/admin/users", {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Anda tidak memiliki izin untuk melihat daftar user");
        }
        throw new Error(data.error || "Gagal mengambil data user");
      }

      setUserList(data.users);
      setModalType("userlist");
      setShowModal(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setError("");
    setSuccess("");
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
                    placeholder="Username (minimal 3 karakter)"
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
                    placeholder="Password (minimal 6 karakter)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <button
                  className={`btn btn-neutral w-full mt-4 ${loading ? 'loading' : ''}`}
                  onClick={handleRegister}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Register'}
                </button>
                <div className="text-center text-sm text-gray-500">atau, sudah punya akun?</div>
                {/* Fixed: Replace button with Link */}
                <Link 
                  to="/login" 
                  className={`btn btn-outline w-full inline-flex items-center justify-center ${loading ? 'btn-disabled' : ''}`}
                  style={{ 
                    pointerEvents: loading ? 'none' : 'auto',
                    textDecoration: 'none' 
                  }}
                >
                  Login
                </Link>
              </fieldset>

              {error && (
                <div className="alert alert-error mt-4">
                  <span>Error: {error?.message || error}</span>
                  {error?.errors && (
                    <ul className="list-disc pl-4 mt-2">
                      {error.errors.map((err) => (
                        <li key={err.param}>{err.msg}</li>
                      ))}
                    </ul>
                  )}
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

      {/* Register Success Modal */}
      {showModal && modalType === "register" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center w-full max-w-sm">
            <div className="text-green-500 text-4xl mb-4">✓</div>
            <h2 className="text-xl font-bold mb-4 text-green-600">Register Berhasil!</h2>
            <p className="mb-4">
              Username <strong>{userName}</strong> telah berhasil terdaftar.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Anda sekarang dapat menggunakan akun ini untuk login.
            </p>
            <button
              className="btn btn-success"
              onClick={closeModal}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* User List Modal */}
      {showModal && modalType === "userlist" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg max-h-96">
            <h2 className="text-xl font-bold mb-4 text-center">
              Daftar Pengguna ({userList.length})
            </h2>
            {userList.length > 0 ? (
              <div className="max-h-60 overflow-y-auto">
                <div className="space-y-2">
                  {userList.map((user, index) => (
                    <div key={user.id || index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-gray-600">
                        Role: <span className="capitalize">{user.role}</span>
                      </div>
                      {user.created_at && (
                        <div className="text-xs text-gray-500">
                          Bergabung: {new Date(user.created_at).toLocaleDateString('id-ID')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500">Tidak ada pengguna ditemukan</p>
            )}
            <button
              onClick={closeModal}
              className="btn btn-outline w-full mt-4"
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