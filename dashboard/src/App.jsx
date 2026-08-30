import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertTriangle, Thermometer, Droplets, Wind, Activity } from 'lucide-react';
import L from 'leaflet';
import CinematicLanding from './CinematicLanding';

// Fix for default Leaflet icon in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AlertBanner = ({ message, type = 'warning' }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-4 rounded-xl mb-4 flex items-center gap-3 backdrop-blur-md border ${
        type === 'critical' ? 'bg-red-500/20 border-red-500/50 text-red-200' :
        type === 'warning' ? 'bg-amber-500/20 border-amber-500/50 text-amber-200' :
        'bg-blue-500/20 border-blue-500/50 text-blue-200'
      }`}
    >
      <AlertTriangle className={`w-6 h-6 ${type === 'critical' ? 'text-red-400' : 'text-amber-400'}`} />
      <div className="flex-1">
        <h4 className="font-bold">{type === 'critical' ? 'Critical Alert' : 'Warning'}</h4>
        <p className="text-sm opacity-90">{message}</p>
      </div>
    </motion.div>
  );
}

const MetricCard = ({ title, value, unit, icon: Icon, colorClass, trend }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 p-5 rounded-2xl flex flex-col gap-2"
    >
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-lg ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-white">{value}</span>
          <span className="text-slate-400 text-sm">{unit}</span>
        </div>
      </div>
    </motion.div>
  );
};

const Gauge = ({ value, label }) => {
  // Simple SVG Gauge
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  
  // Color based on risk (low = green, high = red)
  const color = value < 30 ? '#4ade80' : value < 70 ? '#facc15' : '#ef4444';

  return (
    <div className="flex flex-col items-center justify-center bg-slate-800/60 backdrop-blur-md border border-slate-700/50 p-6 rounded-2xl w-full">
      <div className="relative flex items-center justify-center">
        <svg className="transform -rotate-90 w-24 h-24">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-700"
          />
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="48"
            cy="48"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-white">{value}</span>
        </div>
      </div>
      <p className="mt-3 font-medium text-slate-300">{label}</p>
    </div>
  );
};

function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen font-sans text-slate-100 bg-black">
      
      {/* Cinematic Landing Sequence */}
      <CinematicLanding />
      
      {/* Scrollable Dashboard Content */}
      <main className="relative z-10 w-full max-w-md mx-auto min-h-screen flex flex-col p-5 pb-20 mt-10">
        
        <header className="py-6 pt-10 flex flex-col items-center mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-emerald-500/30 shadow-lg"
          >
            <img 
              src="/assets/logo-agrishield365.jpg" 
              alt="AgriShield 365 Logo" 
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400"
          >
            Field Dashboard
          </motion.h2>
        </header>

        <div className="flex flex-col gap-6">
          {/* Alerts Section */}
          <section>
            <AlertBanner message="High temperature detected in Sector 4. Irrigation recommended." type="warning" />
            <AlertBanner message="Soil moisture critically low in Sector 7." type="critical" />
          </section>

          {/* Core Metrics */}
          <section className="grid grid-cols-2 gap-4">
            <MetricCard 
              title="Temperature" 
              value="29" 
              unit="°C" 
              icon={Thermometer} 
              colorClass="bg-orange-500/20 text-orange-400"
              trend={+2.4}
            />
            <MetricCard 
              title="Soil Moisture" 
              value="42" 
              unit="%" 
              icon={Droplets} 
              colorClass="bg-blue-500/20 text-blue-400"
              trend={-5.1}
            />
            <MetricCard 
              title="Wind Speed" 
              value="12" 
              unit="km/h" 
              icon={Wind} 
              colorClass="bg-teal-500/20 text-teal-400"
            />
            <MetricCard 
              title="Crop Health" 
              value="92" 
              unit="%" 
              icon={Activity} 
              colorClass="bg-emerald-500/20 text-emerald-400"
              trend={+1.2}
            />
          </section>

          {/* Risk Gauge */}
          <section className="mt-2">
            <Gauge value={85} label="Overall Risk Score" />
          </section>

          {/* Map Section */}
          <section className="mt-4">
            <h3 className="text-lg font-bold mb-3 text-slate-200">Field Overview</h3>
            <div className="bg-slate-800/60 backdrop-blur-md p-2 rounded-2xl border border-slate-700/50 shadow-xl">
              <div className="map-container rounded-xl overflow-hidden relative z-0">
                <MapContainer 
                  center={[36.720, -119.787]} 
                  zoom={12} 
                  scrollWheelZoom={false}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  />
                  <Marker position={[36.720, -119.787]}>
                    <Popup className="bg-slate-800 text-slate-100 border-none rounded shadow-lg">
                      <div className="font-bold">Sector 4</div>
                      <div>Temp: 29°C</div>
                    </Popup>
                  </Marker>
                  <Marker position={[36.710, -119.795]}>
                    <Popup>
                      <div className="font-bold">Sector 7</div>
                      <div className="text-red-500">Moisture Low</div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </section>
          
          {/* Spacer for scroll effect */}
          <div className="h-40 flex items-center justify-center">
            <p className="text-slate-500 text-sm">End of Dashboard</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
