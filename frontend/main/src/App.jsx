import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Room from "./components/Room";
import Reservation from "./components/Reservation";
import Contact from "./components/Contact";
import Register from "./components/Register";
import AdminRoom from "./components/Admin/Room";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room" element={<Room />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        {/* Admin */}
        <Route path="/admin/room" element={<AdminRoom />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
