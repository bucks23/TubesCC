const Dashboard = ({ stats = { kamar: 0, guest: 0, booking: 0 } }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-600">Jumlah Kamar</h2>
          <p className="text-3xl font-bold">{stats.kamar}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-600">Jumlah Guest</h2>
          <p className="text-3xl font-bold">{stats.guest}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-600">Jumlah Pemesanan</h2>
          <p className="text-3xl font-bold">{stats.booking}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
