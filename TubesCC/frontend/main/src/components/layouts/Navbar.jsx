import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`navbar fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      } p-3`}
    >
      <div className="flex-1 ml-5">
        <Link
          to="/"
          className={`btn btn-ghost text-xl transition-colors duration-300 ${
            scrolled ? "text-black" : "text-white"
          }`}
        >
          BookingMe
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
            <Link to="/reservation">Reservation</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
