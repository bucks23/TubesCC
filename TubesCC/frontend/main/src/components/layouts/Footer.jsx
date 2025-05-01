import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer sm:footer-horizontal bg-base-200 text-base-content p-10 justify-around">
      <aside className="flex flex-col items-center gap-2 text-center">
        <img src="/img/logo.png" alt="BookingMe Logo" className="w-24 h-24" />
        <p>
          BookingMe
          <br />
          &copy; {new Date().getFullYear()} - All right reserved
        </p>
      </aside>

      <nav>
        <h6 className="footer-title">Services</h6>
        <Link to="/room" className="link link-hover">
          Room
        </Link>
        <Link to="/restaurant-and-bar" className="link link-hover">
          Restaurant & Bar
        </Link>
        <Link to="/meeting-and-conference" className="link link-hover">
          Meeting & Conference
        </Link>
        <Link to="/facilities-and-benefit" className="link link-hover">
          Facilities & Benefit
        </Link>
      </nav>
      <nav>
        <h6 className="footer-title">Company</h6>
        <Link to="/about" className="link link-hover">
          About us
        </Link>
        <Link to="/contact" className="link link-hover">
          Contact
        </Link>
        <Link to="/career" className="link link-hover">
          Career
        </Link>
      </nav>
      <nav>
        <h6 className="footer-title">Legal</h6>
        <Link to="/terms-of-use" className="link link-hover">
          Term of use
        </Link>
        <Link to="/privacy-policy" className="link link-hover">
          Privacy policy
        </Link>
        <Link to="/cookie-policy" className="link link-hover">
          Cookie policy
        </Link>
      </nav>
    </footer>
  );
}

export default Footer;
