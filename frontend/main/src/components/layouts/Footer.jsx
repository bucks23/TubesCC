import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-indigo-800 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-start gap-12">
        {/* Logo & copyright */}
        <aside className="flex flex-col items-center md:items-start gap-4">
          <img
            src="/img/logo-putih.png"
            alt="Pacific Up Logo"
            className="h-32 object-contain"
          />
          <p className="text-sm text-gray-400 text-center md:text-left">
            &copy; {new Date().getFullYear()} Pacific Up. All rights reserved.
          </p>
          <div className="flex gap-4 mt-2 ms-15">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </aside>

        {/* Navigasi Footer */}
        <nav className="grid grid-cols-1 sm:grid-cols-3 gap-10 w-full max-w-4xl">
          <div>
            <h6 className="text-lg font-semibold text-white mb-4">Services</h6>
            <ul className="space-y-2">
              <li>
                <Link to="/room" className="hover:text-white transition">
                  Room
                </Link>
              </li>
              <li>
                <Link
                  to="/restaurant-and-bar"
                  className="hover:text-white transition"
                >
                  Restaurant & Bar
                </Link>
              </li>
              <li>
                <Link
                  to="/meeting-and-conference"
                  className="hover:text-white transition"
                >
                  Meeting & Conference
                </Link>
              </li>
              <li>
                <Link
                  to="/facilities-and-benefit"
                  className="hover:text-white transition"
                >
                  Facilities & Benefit
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h6 className="text-lg font-semibold text-white mb-4">Company</h6>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/career" className="hover:text-white transition">
                  Career
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h6 className="text-lg font-semibold text-white mb-4">Legal</h6>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/terms-of-use"
                  className="hover:text-white transition"
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-white transition"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/cookie-policy"
                  className="hover:text-white transition"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
