import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Admin/Home";
import Room from "./components/Room";
import Contact from "./components/Contact";
import Register from "./components/Register";
import Login from "./components/Login";
import Booking from "./components/Booking";
import Payment from "./components/Payment";
import AdminRoom from "./components/Admin/RoomsTable";
import UsersTable from "./components/Admin/UserTable";
import BookingsTable from "./components/Admin/BookingsTable";
import AdminProfile from "./components/Admin/AdminProfile";
import PrometheusMetrics from "./components/PrometheusMetrics";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/room" element={<Room />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking/:roomId" element={<Booking />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/rooms"
            element={
              <ProtectedRoute>
                <AdminRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <UsersTable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute>
                <BookingsTable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute>
                <AdminProfile />
              </ProtectedRoute>
            }
          />

          {/* Prometheus (no auth needed unless required) */}
          <Route path="/metrics" element={<PrometheusMetrics />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
};

export default App;
