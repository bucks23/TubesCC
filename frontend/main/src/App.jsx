import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Room from "./components/Room";
import Contact from "./components/Contact";
import Register from "./components/Register";
import Login from "./components/Login";
import Booking from "./components/Booking";
import Payment from "./components/Payment";
import AdminRoom from "./components/Admin/Room";
import PrometheusMetrics from "./components/PrometheusMetrics";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room" element={<Room />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking/:roomId" element={<Booking />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* Admin */}
          <Route path="/admin/room" element={<AdminRoom />} />
          {/* Prometheus Metrics */}
          <Route path="/metrics" element={<PrometheusMetrics />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
};
export default App;
