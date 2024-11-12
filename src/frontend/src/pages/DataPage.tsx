const DataPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Weather Data Management</h1>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
        {/* Section des données GSOD */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-medium mb-4">GSOD Data</h2>
          <p className="text-gray-600 mb-4">
            Global Surface Summary of the Day (GSOD) data from NOAA.
          </p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Manage GSOD Data
          </button>
        </div>

        {/* Section des données ISD */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-medium mb-4">ISD Data</h2>
          <p className="text-gray-600 mb-4">
            Integrated Surface Database (ISD) from NOAA.
          </p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Manage ISD Data
          </button>
        </div>

        {/* Section des rapports de tempêtes */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-medium mb-4">Storm Reports</h2>
          <p className="text-gray-600 mb-4">
            Storm Events Database reports and analysis.
          </p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            View Storm Reports
          </button>
        </div>

        {/* Section des données textuelles */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-medium mb-4">Text Products</h2>
          <p className="text-gray-600 mb-4">
            NCEI Climate Data Online Text Products.
          </p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Browse Text Data
          </button>
        </div>
      </div>

      {/* Section des statistiques */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-medium mb-4">Data Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-gray-600">Total Records</p>
            <p className="text-2xl font-bold">1.2M</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Last Update</p>
            <p className="text-2xl font-bold">2h ago</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Storage Used</p>
            <p className="text-2xl font-bold">8.5 GB</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPage;
