import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./layouts/sidebar";
import Dashboard from "./Dashboard";

const Home = () => {
  const [stats, setStats] = useState({ kamar: 0, guest: 0, booking: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomsRes = await axios.get(
          "https://web-production-f02bf.up.railway.app/https://adventurous-motivation-production.up.railway.app/api/rooms"
        );

        const usersRes = await axios.get(
          "https://web-production-f02bf.up.railway.app/https://adventurous-motivation-production.up.railway.app/api/auth/admin/users"
        );

        const bookingsRes = await axios.get(
          "https://web-production-f02bf.up.railway.app/https://adventurous-motivation-production.up.railway.app/api/booking"
        );

        const kamarCount = roomsRes.data.length;
        const guestCount = usersRes.data.length;
        const bookingCount = bookingsRes.data.length;

        setStats({
          kamar: kamarCount,
          guest: guestCount,
          booking: bookingCount,
        });
      } catch (error) {
        console.error("Gagal fetch data dashboard:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-100">
        <Dashboard stats={stats} />
      </main>
    </div>
  );
};

export default Home;
