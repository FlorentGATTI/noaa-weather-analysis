import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function App() {
  const [temperatureTrends, setTemperatureTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemperatureTrends = async () => {
      try {
        const response = await fetch('http://localhost:8000/weather/analysis/temperature-trends?start_year=2019&end_year=2023', {
          headers: {
            'X-API-Key': process.env.REACT_APP_API_KEY || 'development_key'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();
        setTemperatureTrends(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTemperatureTrends();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Router>
      <div className="App">
        <nav className="bg-blue-600 text-white p-4">
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:text-blue-200">Home</Link></li>
            <li><Link to="/temperature" className="hover:text-blue-200">Temperature Trends</Link></li>
            <li><Link to="/storm-events" className="hover:text-blue-200">Storm Events</Link></li>
          </ul>
        </nav>

        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">NOAA Weather Analysis Dashboard</h1>
                <p className="mb-4">Explore weather data and trends from NOAA datasets</p>
              </div>
            } />

            <Route path="/temperature" element={
              <div>
                <h2 className="text-2xl font-bold mb-4">Temperature Trends</h2>
                <div className="w-full overflow-x-auto">
                  <LineChart
                    width={800}
                    height={400}
                    data={temperatureTrends}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="avg_temp" stroke="#8884d8" name="Average Temperature" />
                    <Line type="monotone" dataKey="max_temp" stroke="#82ca9d" name="Maximum Temperature" />
                    <Line type="monotone" dataKey="min_temp" stroke="#ff7300" name="Minimum Temperature" />
                  </LineChart>
                </div>
              </div>
            } />

            <Route path="/storm-events" element={
              <div>
                <h2 className="text-2xl font-bold mb-4">Storm Events</h2>
                {/* Storm events content will be implemented later */}
                <p>Coming soon...</p>
              </div>
            } />
          </Routes>
        </main>

        <footer className="bg-gray-100 p-4 mt-8">
          <div className="container mx-auto text-center text-gray-600">
            <p>NOAA Weather Analysis Project - {new Date().getFullYear()}</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
