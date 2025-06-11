import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Handle scroll untuk efek navbar
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Cek status login saat pertama kali mount
    checkAuthStatus();

    // Listener untuk event login agar navbar update otomatis
    const handleLoginEvent = () => {
      checkAuthStatus();
    };
    window.addEventListener("user-login", handleLoginEvent);

    return () => window.removeEventListener("user-login", handleLoginEvent);
  }, []);

  const checkAuthStatus = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const response = await fetch("https://adventurous-motivation-production.up.railway.app/api/auth/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Token invalid / expired
        localStorage.removeItem("access_token");
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      localStorage.removeItem("access_token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    navigate("/");
  };

  const renderAuthLinks = () => {
    if (isLoading) {
      return (
        <li>
          <span className="loading loading-spinner loading-sm"></span>
        </li>
      );
    }

    if (user) {
      return (
        <li className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost flex items-center gap-1"
          >
            <span role="img" aria-label="user">
              👤
            </span>
            <span>{user.username}</span>
            <svg
              className="fill-current w-4 h-4 ml-1"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
          <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 text-black">
            <li>
              <Link to="/profile" className="flex items-center gap-2">
                <span role="img" aria-label="profile">
                  👤
                </span>
                Profile
              </Link>
            </li>
            {user.role === "admin" && (
              <li>
                <Link to="/admin" className="flex items-center gap-2">
                  <span role="img" aria-label="admin">
                    ⚙️
                  </span>
                  Admin Panel
                </Link>
              </li>
            )}
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left gap-2"
              >
                <span role="img" aria-label="logout">
                  🚪
                </span>
                Logout
              </button>
            </li>
          </ul>
        </li>
      );
    }

    // Jika belum login, sesuaikan link berdasarkan halaman sekarang
    if (location.pathname === "/login") {
      return (
        <li>
          <Link to="/register">Register</Link>
        </li>
      );
    }

    if (location.pathname === "/register") {
      return (
        <li>
          <Link to="/login">Login</Link>
        </li>
      );
    }

    return (
      <li>
        <Link to="/login">Login</Link>
      </li>
    );
  };

  return (
    <div
      className={`navbar fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      } p-3`}
    >
      <div className="flex-1 ml-5">
        <Link to="/" className="p-0">
          <img
            src={scrolled ? "/img/logo-samping.png" : "/img/logo-putih.png"}
            alt="Logo"
            className="h-16 ms-10 transition-all duration-300 select-none pointer-events-auto"
            draggable="false"
          />
        </Link>
      </div>
      <div className="flex-none me-5">
        <ul
          className={`menu menu-horizontal px-1 transition-colors duration-300 ${
            scrolled ? "text-black" : "text-white"
          }`}
        >
          <li>
            <Link to="/">Beranda</Link>
          </li>
          <li>
            <Link to="/room">Room</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          {renderAuthLinks()}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
